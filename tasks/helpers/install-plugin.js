/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("install_plugin", function (plug, isUpdate, cb) {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");

		var pkg = require("../utils/pkg");
		var pristinePkg = require(pkg.config.dirs.robin + "/package.json");
		var localPkg = require("../utils/local-pkg");

		var wrench = require("wrench");

		var bpName = (pkg.config && pkg.config.org) ? pkg.config.org.name : pkg.name;

		var plugSrcPkg;

		var completeInstall = function (plug, plugPkg, cb) {
			var plugPath = path.join(pkg.config.dirs.robin, plug);

			if (fs.existsSync(plugPath)) {
				wrench.rmdirSyncRecursive(plugPath);
			}

			var plugInitScript = plugPkg.scripts && plugPkg.scripts.initialize ? plugPkg.scripts.initialize : null;

			var initialize;

			if (plugInitScript) {
				pkg.scripts = pkg.scripts || {};
				pkg.scripts.initialize = pkg.scripts.initialize || {};

				initialize = pkg.scripts.initialize;

				if (initialize && initialize.length) {
					if (initialize.indexOf(plugInitScript) === -1) {
						pkg.scripts.initialize.push(plugInitScript);
					}
				} else {
					pkg.scripts.initialize = [plugInitScript];
				}
			}

			if (plugSrcPkg) {
				plugPkg.version = plugSrcPkg.version || plugPkg.version;
				plugPkg.description = plugSrcPkg.description || plugPkg.description;
			}

			pkg.config.installedPlugins[plug] = {
				version : plugPkg.version,
				description : plugPkg.description
			};

			pkg.save();

			if (cb) {
				cb();
			}
		};

		var runInstaller = function (plug, plugPkg, cb) {
			var install = (plugPkg.scripts || {}).install;

			if (install) {
				var args = install.split(" "),
					cmd = args.shift(),
					pluginDir = path.join(pkg.config.dirs.robin, pristinePkg.config.dirs.plugins),
					file = path.join(pluginDir, plug, args.join(""));

				if (cmd === "node" && fs.existsSync(file)) {
					var initializer = require(fs.realpathSync(file));

					initializer.run(function (error) {
						if (error) {
							grunt.fail.warn(error);
						}

						completeInstall(plug, plugPkg, cb);
					});
				} else {
					completeInstall(plug, plugPkg, cb);
				}
			} else {
				completeInstall(plug, plugPkg, cb);
			}
		};

		var copyFiles = function (plug, plugPkg, cb) {
			var scope = (plugPkg.config || {}).scope || "";
			var plugDir = path.join(pkg.config.dirs.robin, plug);
			var repoPaths = grunt.file.expandFiles(plugDir + "/**/*");
			var i, j, file, newFile;

			var exclude = [
				"package.json",
				".gitignore",
				"README.md"
			];

			if (isUpdate) {
				exclude.push("**/__" + "PROJECT_NAME" + "__/**/*");
			}

			for (i = 0, j = repoPaths.length; i < j; i++) {
				file = repoPaths[i];

				if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
					newFile = file.replace(plug, path.join("../", scope)).replace(/\/\//g, "/");

					grunt.log.writeln(("Adding " + newFile.replace(pkg.config.dirs.robin + "/../", "")).grey);
					grunt.file.copy(file, newFile);
				}
			}

			if (plugPkg.config.localFiles) {
				var pluginDir = path.join(pkg.config.dirs.robin, pristinePkg.config.dirs.plugins);
				var localDir = path.join(pluginDir, plug, plugPkg.config.localFiles);
				var localPaths = grunt.file.expandFiles({
					dot : true
				}, localDir + "/**/*");

				for (i = 0, j = localPaths.length; i < j; i++) {
					file = localPaths[i];

					if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
						newFile = file.replace(localDir + "/", "");
						grunt.log.writeln(("Adding " + newFile).grey);
						grunt.file.copy(file, newFile);
					}
				}

				var gitIgnore = localDir + "/.gitignore";
				if (fs.existsSync(gitIgnore)) {
					var currGitIgnore = process.cwd() + "/.gitignore";
					grunt.log.writeln("Updating .gitignore");

					if (fs.existsSync(currGitIgnore)) {
						grunt.file.write(currGitIgnore, [
							grunt.file.read(currGitIgnore),
							grunt.file.read(gitIgnore)
						].join("\n"));
					} else {
						grunt.file.copy(gitIgnore, currGitIgnore);
					}
				}
			}

			runInstaller(plug, plugPkg, cb);
		};

		var doReplacement = function (plug, plugPkg, cb) {
			var doReplacement = plugPkg.config.replaceVars;

			// Replace variables
			if (doReplacement) {
				var plugDir = path.join(pkg.config.dirs.robin, plug);

				grunt.helper("replace_in_files", function () {
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

		var saveLocalPaths = function (plugPkg) {
			var i, j;

			var localReqPaths = localPkg.config.requiredPaths || [];
			var plugReqPaths = plugPkg.config.requiredPaths || [];

			for (i = 0, j = plugReqPaths.length; i < j; i++) {
				if (localReqPaths.indexOf(plugReqPaths[i]) === -1) {
					localReqPaths.push(plugReqPaths[i]);
				}
			}

			var localExcPaths = localPkg.config.excludedPaths || [];
			var plugExcPaths = plugPkg.config.excludedPaths || [];

			for (i = 0, j = plugExcPaths.length; i < j; i++) {
				if (localExcPaths.indexOf(plugExcPaths[i]) === -1) {
					localExcPaths.push(plugExcPaths[i]);
				}
			}

			localPkg.config.requiredPaths = localReqPaths;
			localPkg.config.excludedPaths = localExcPaths;

			localPkg.save();
		};

		var findLocalPaths = function (plug, plugPkg, cb) {
			if (plugPkg.config && plugPkg.config.requiredPaths) {
				saveLocalPaths(plugPkg);
			}

			doReplacement(plug, plugPkg, cb);
		};

		var installDependencies = function (plug, plugPkg, cb) {
			var callUpdate;
			var dep;
			var pluginDeps = [];

			for (dep in plugPkg.dependencies) {
				if (!pkg.dependencies[dep] || pkg.dependencies[dep] !== plugPkg.dependencies[dep]) {
					pkg.dependencies[dep] = plugPkg.dependencies[dep];
					pluginDeps.push(dep + "@" + plugPkg.dependencies[dep]);

					callUpdate = true;
				}
			}

			for (dep in plugPkg.devDependencies) {
				if (!pkg.devDependencies[dep] || pkg.devDependencies[dep] !== plugPkg.devDependencies[dep]) {
					pkg.devDependencies[dep] = plugPkg.devDependencies[dep];
				}
			}

			var plugSrcPath = "%s/package.json".replace("%s", plug);

			if (fs.existsSync("./" + plugSrcPath)) {
				plugSrcPkg = require(fs.realpathSync(plugSrcPath));
			}

			if (callUpdate) {
				var child = cp.spawn("npm", ["install"].concat(pluginDeps), {
					env: null,
					setsid: true,
					stdio: "inherit"
				});

				child.on("exit", function () {
					findLocalPaths(plug, plugPkg, cb);
				});

				return;
			} else {
				findLocalPaths(plug, plugPkg, cb);
			}
		};

		var saveSystemDependencies = function (plug, plugPkg, cb) {
			var plugSysDeps = plugPkg.systemDependencies,
				currSysDeps = pkg.systemDependencies || {},
				regexp = /(?:([<>=]+)?(?:\s+)?)([\d\.]+)/,
				plugDep, currDep, plugMatch, currMatch;

			for (var dep in plugSysDeps) {
				plugDep = plugSysDeps[dep];
				currDep = currSysDeps[dep];

				if (currDep) {
					plugMatch = plugDep.match(regexp);
					currMatch = currDep.match(regexp);

					if (plugMatch[2] > currMatch[2]) {
						currSysDeps[dep] = plugDep;
					}
				} else {
					currSysDeps[dep] = plugDep;
				}
			}

			pkg.systemDependencies = currSysDeps;
			pkg.save();

			installDependencies(plug, plugPkg, cb);
		};

		var checkSystemDependencies = function (plug, plugPkg, cb) {
			if (plugPkg && plugPkg.systemDependencies) {
				grunt.helper("check_dependencies", plugPkg, function () {
					saveSystemDependencies(plug, plugPkg, cb);
				}, function (error) {
					cb(error);
				});
			} else {
				installDependencies(plug, plugPkg, cb);
			}
		};

		var installPlugin = function (plug, cb) {
			var pluginDir = path.join(pkg.config.dirs.robin, pristinePkg.config.dirs.plugins);
			var plugDir = path.join(pluginDir, plug);

			if (fs.existsSync(plugDir)) {
				var plugPkg = grunt.file.readJSON(plugDir + "/package.json");
				var plugRepo = plugPkg.repository;
				var source = (plugRepo ? plugRepo.url : plugDir);

				grunt.log.writeln();
				grunt.log.writeln(("[!]".magenta + (" Installing " + plugPkg.name + " from " + source).grey).bold);

				if (plugRepo) {
					var plugBranch = plugRepo.branch || "master";
					var plugPath = path.join(pkg.config.dirs.robin, plug);

					grunt.file.mkdir(plugPath);

					var child = cp.spawn("git", [
						"clone",
						"--depth", "1",
						"--branch", plugBranch,
						plugRepo.url,
						plugPath
					], {
						env: null,
						setsid: true,
						stdio: "inherit"
					});

					child.on("exit", function () {
						checkSystemDependencies(plug, plugPkg, cb);
					});
				} else {
					checkSystemDependencies(plug, plugPkg, cb);
				}
			} else if (cb) {
				cb(true);
			}
		};

		if (pkg.config.installedPlugins[plug]) {
			grunt.log.writeln("You've already installed %s!".yellow.replace("%s", plug));

			if (cb) {
				cb(true);
			}
			return;
		} else {
			installPlugin(plug, cb);
		}
	});

};
