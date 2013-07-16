/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var installPlugin = function (plug, isUpdate, cb) {
		var helper = require("../helpers").init(grunt);

		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");
		var cwd = process.cwd();

		var pkg = require("../utils/pkg");
		var pristinePkg = require(path.join(cwd, pkg.config.dirs.robyn, "package.json"));
		var localPkg = require("../utils/local-pkg");

		var branch;
		var bits = plug.split("@");

		if (bits.length === 1) {
			plug = bits[0];
		} else {
			plug = bits[0];
			branch = bits[1];
		}

		var wrench = require("wrench");
		var bpName = pkg.name;

		var storePkgScripts = function (plug, plugPkg) {
			var plugScripts = plugPkg.scripts || {};

			for (var key in plugScripts) {
				var script;
				var plugScript = plugScripts[key];

				if (plugScript) {
					pkg.scripts = pkg.scripts || {};
					pkg.scripts[key] = pkg.scripts[key] || {};

					script = pkg.scripts[key];

					if (script && script.length) {
						if (script.indexOf(plugScript) === -1) {
							pkg.scripts[key].push(plugScript);
						}
					} else {
						pkg.scripts[key] = [plugScript];
					}
				}
			}
		};

		var completeInstall = function (plug, plugPkg, cb) {
			var plugPath = path.join(cwd, pkg.config.dirs.robyn, plug);

			storePkgScripts(plug, plugPkg);

			var plugSrcPath = path.join(plugPath, "package.json");

			if (fs.existsSync(plugSrcPath)) {
				var plugSrcPkg = require(plugSrcPath);

				plugPkg.version = plugSrcPkg.version || plugPkg.version;
				plugPkg.description = plugSrcPkg.description || plugPkg.description;
			}

			pkg.installedPlugins[plug] = {
				version : plugPkg.version,
				description : plugPkg.description
			};

			pkg.save();

			if (fs.existsSync(plugPath)) {
				wrench.rmdirSyncRecursive(plugPath);
			}

			if (cb) {
				cb();
			}
		};

		var handleProcess = function (file, plug, plugPkg, cb) {
			if (fs.existsSync(file)) {
				var handler = require(fs.realpathSync(file));

				handler(grunt, helper, function (error) {
					if (error) {
						grunt.fail.warn(error);
					}

					completeInstall(plug, plugPkg, cb);
				});
			} else {
				completeInstall(plug, plugPkg, cb);
			}
		};

		var runInstaller = function (plug, plugPkg, cb) {
			var scripts = plugPkg.scripts || {};
			var pluginDir = path.join(pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);

			for (var key in scripts) {
				var script = scripts[key];

				if ((/^\.\//).test(script)) {
					scripts[key] = path.join(pluginDir, plug, script);
				}
			}

			if (!isUpdate && scripts.install) {
				handleProcess(scripts.install, plug, plugPkg, cb);
			} else if (isUpdate && scripts.update) {
				handleProcess(scripts.update, plug, plugPkg, cb);
			} else {
				completeInstall(plug, plugPkg, cb);
			}
		};

		var buildExcludes = function (root) {
			var exclude = [
				path.join(root, "{.git,test}", "**", "*"),
				path.join(root, "package.json"),
				path.join(root, ".{gitignore,travis.yml}"),
				path.join(root, "README.md")
			].map(function (path) {
				return "!" + path;
			});

			return exclude;
		};

		var copyGitIgnore = function (plug, plugPkg, cb) {
			var localFiles = "defaults";
			var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
			var localDir = path.join(pluginDir, plug, localFiles);
			var gitIgnore = path.join(localDir, ".gitignore");
			var i, j;

			if (fs.existsSync(gitIgnore)) {
				var currGitIgnore = path.join(cwd, ".gitignore");

				if (fs.existsSync(currGitIgnore)) {
					var newLines = grunt.file.read(gitIgnore).split("\n");
					var currLines = grunt.file.read(currGitIgnore).split("\n");

					for (i = 0, j = newLines.length; i < j; i++) {
						var line = newLines[i];

						if (currLines.indexOf(line) === -1) {
							currLines.push(line);
						}
					}

					grunt.file.write(currGitIgnore, currLines.join("\n"));
				} else {
					grunt.file.copy(gitIgnore, currGitIgnore);
				}

				grunt.log.write(".".grey);
			}

			grunt.log.write("...".grey);
			grunt.log.ok();

			runInstaller(plug, plugPkg, cb);
		};

		var copyFiles = function (plug, plugPkg, cb) {
			var scope = (plugPkg.config || {}).scope || "";
			var plugDir = path.join(cwd, pkg.config.dirs.robyn, plug);
			var i, j, file, newFile;

			helper.write("Copying files into project".grey);

			var exclude = buildExcludes(plugDir);

			if (isUpdate) {
				exclude.push("!" + path.join(plugDir, "**", "__" + "PROJECT_NAME" + "__", "**", "*"));
			}

			var repoPaths = grunt.file.expand({
				filter: "isFile",
				dot : true
			}, [path.join(plugDir, "**", "*")].concat(exclude));

			var verbose = grunt.option("verbose");

			repoPaths.forEach(function (file) {
				newFile = file.replace(plugDir, path.join(process.cwd(), scope)).replace(/\/\//g, "/");
				grunt.file.copy(file, newFile);

				if (!verbose) {
					grunt.log.write(".".grey);
				}
			});

			var localFiles = "defaults";
			var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
			var localDir = path.join(pluginDir, plug, localFiles);

			exclude = buildExcludes(localDir);

			if (fs.existsSync(localDir)) {
				var localPaths = grunt.file.expand({
					filter: "isFile",
					dot : true
				}, [localDir + "/**/*"].concat(exclude));

				localPaths.forEach(function (file) {
					newFile = file.replace(localDir + "/", "");
					grunt.file.copy(file, newFile);

					if (!verbose) {
						grunt.log.write(".".grey);
					}
				});

				var doReplacement = plugPkg.config.replaceVars;
				var localPlugFiles = path.join(cwd, pkg.config.dirs.config, plug);

				if (doReplacement && fs.existsSync(localPlugFiles)) {
					helper.replaceInFiles(function () {
						copyGitIgnore(plug, plugPkg, cb);
					}, {
						root : localPlugFiles,
						config : {
							dot : true
						}
					});
				} else {
					copyGitIgnore(plug, plugPkg, cb);
				}
			} else {
				grunt.log.write("...".grey);
				grunt.log.ok();

				runInstaller(plug, plugPkg, cb);
			}
		};

		var doReplacement = function (plug, plugPkg, cb) {
			var doReplacement = plugPkg.config.replaceVars;

			// Replace variables
			if (doReplacement) {
				var plugDir = path.join(cwd, pkg.config.dirs.robyn, plug);

				helper.replaceInFiles(function () {
					copyFiles(plug, plugPkg, cb);
				}, {
					root : plugDir,
					config : {
						dot : true
					}
				});
			} else {
				copyFiles(plug, plugPkg, cb);
			}
		};

		var cloneExternalRepo = function (plug, plugPkg, cb) {
			var plugRepo = plugPkg.repository;

			if (plugRepo) {
				var plugBranch = branch || plugRepo.branch || "master";
				var plugPath = path.join(cwd, pkg.config.dirs.robyn, plug);

				if (fs.existsSync(plugPath)) {
					wrench.rmdirSyncRecursive(plugPath);
				}

				grunt.file.mkdir(plugPath);

				helper.spawn({
					cmd: "git",
					args: ["clone", "--depth", "1", "--branch", plugBranch, plugRepo.url, plugPath],
					title: "Cloning repository",
					complete: function () {
						doReplacement(plug, plugPkg, cb);
					}
				});
			} else {
				doReplacement(plug, plugPkg, cb);
			}
		};

		var installDependencies = function (plug, plugPkg, cb) {
			var projectPkg = require(path.join(cwd, "package.json"));
			var semver = require("semver");
			var callUpdate;
			var dep;
			var isGreater;
			var pluginDeps = [];

			for (dep in plugPkg.dependencies) {
				isGreater = semver.gt(plugPkg.dependencies[dep], projectPkg.dependencies[dep]);
				if (!projectPkg.dependencies[dep] || isGreater) {
					projectPkg.dependencies[dep] = plugPkg.dependencies[dep];
					pluginDeps.push(dep + "@" + plugPkg.dependencies[dep]);

					callUpdate = true;
				}
			}

			for (dep in plugPkg.devDependencies) {
				isGreater = semver.gt(plugPkg.devDependencies[dep], projectPkg.devDependencies[dep]);
				if (!projectPkg.devDependencies[dep] || isGreater) {
					projectPkg.devDependencies[dep] = plugPkg.devDependencies[dep];
				}
			}

			pluginDeps.push("--save");

			if (callUpdate) {
				helper.installModules(pluginDeps, function () {
					cloneExternalRepo(plug, plugPkg, cb);
				});

				return;
			} else {
				cloneExternalRepo(plug, plugPkg, cb);
			}
		};

		var savePaths = function (plugPkg) {
			var i, j;

			var reqPaths = pkg.config.requiredPaths || [];
			var plugReqPaths = plugPkg.config.requiredPaths || [];

			for (i = 0, j = plugReqPaths.length; i < j; i++) {
				if (reqPaths.indexOf(plugReqPaths[i]) === -1) {
					reqPaths.push(plugReqPaths[i]);
				}
			}

			var excPaths = pkg.config.excludedPaths || [];
			var plugExcPaths = plugPkg.config.excludedPaths || [];

			for (i = 0, j = plugExcPaths.length; i < j; i++) {
				if (excPaths.indexOf(plugExcPaths[i]) === -1) {
					excPaths.push(plugExcPaths[i]);
				}
			}

			pkg.config.requiredPaths = reqPaths;
			pkg.config.excludedPaths = excPaths;
		};

		var findLocalPaths = function (plug, plugPkg, cb) {
			if (plugPkg.config.requiredPaths || plugPkg.config.excludedPaths) {
				savePaths(plugPkg);
			}

			installDependencies(plug, plugPkg, cb);
		};

		var saveSystemDependencies = function (plug, plugPkg, cb) {
			var semver = require("semver");

			var plugSysDeps = plugPkg.systemDependencies,
				currSysDeps = pkg.systemDependencies || {},
				plugDep, currDep;

			for (var dep in plugSysDeps) {
				plugDep = plugSysDeps[dep];

				currDep = currSysDeps[dep];

				if (currDep) {
					currDep = currDep.version || currDep;

					if (semver.gt(plugDep.version || plugDep, currDep)) {
						currSysDeps[dep] = plugDep;
					}
				} else {
					currSysDeps[dep] = plugDep;
				}
			}

			pkg.systemDependencies = currSysDeps;

			findLocalPaths(plug, plugPkg, cb);
		};

		var checkSystemDependencies = function (plug, plugPkg, cb) {
			if (plugPkg && plugPkg.systemDependencies) {
				helper.checkDependencies(plugPkg, function () {
					saveSystemDependencies(plug, plugPkg, cb);
				}, function (error) {
					cb(error);
				});
			} else {
				findLocalPaths(plug, plugPkg, cb);
			}
		};

		var installPlugin = function (plug, cb) {
			var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
			var plugDir = path.join(pluginDir, plug);

			if (fs.existsSync(plugDir)) {
				var plugPath = path.join(plugDir, "plugin.json");

				if (fs.existsSync(plugPath)) {
					var plugPkg = require(plugPath);
					var plugRepo = plugPkg.repository;
					var source = (plugRepo ? plugRepo.url : plugDir.replace(cwd + "/", ""));

					grunt.log.writeln();
					grunt.log.writeln("[+]".grey + (" Installing " + plugPkg.name + " via " + source).cyan);

					checkSystemDependencies(plug, plugPkg, cb);
				} else {
					grunt.fail.warn("%s not found.".replace("%s", plugPath.replace(cwd + "/", "")));

					if (cb) {
						cb(true);
					}
				}
			} else if (cb) {
				cb(true);
			}
		};

		if (pkg.installedPlugins[plug]) {
			var prompt = require("prompt");
			prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
			prompt.delimiter = prompt.delimter || " ";

			prompt.start();

			prompt.get([{
				name: "force",
				message: "You are upgrading %s. Doing so will overwrite any unstaged files. Continue?".replace("%s", plug).yellow,
				validator: /[y\/n]+/i,
				"default": "Y/n"
			}], function (err, props) {
				var assert = helper.getAssertion(props.force);

				if (assert) {
					installPlugin(plug, cb);
				} else if (cb) {
					cb();
				}
			});
		} else {
			installPlugin(plug, cb);
		}
	};

	return installPlugin;

};
