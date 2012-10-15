/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("install_plugin", function (plug, isUpdate, cb) {
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

		var completeInstall = function (plug, plugPkg, cb) {
			var plugPath = path.join(cwd, pkg.config.dirs.robyn, plug);

			var plugInitScript = (plugPkg.scripts || {}).install;
			var install;

			if (plugInitScript) {
				pkg.scripts = pkg.scripts || {};
				pkg.scripts.install = pkg.scripts.install || {};

				install = pkg.scripts.install;

				if (install && install.length) {
					if (install.indexOf(plugInitScript) === -1) {
						pkg.scripts.install.push(plugInitScript);
					}
				} else {
					pkg.scripts.install = [plugInitScript];
				}
			}

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

		var runInstaller = function (plug, plugPkg, cb) {
			var install = (plugPkg.scripts || {}).install;

			if (!isUpdate && install) {
				var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins),
					file = path.join(pluginDir, plug, install);

				plugPkg.scripts.install = file.replace(cwd + "/", "");

				if (fs.existsSync(file)) {
					var initializer = require(file);

					initializer(grunt, function (error) {
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
			var plugDir = path.join(cwd, pkg.config.dirs.robyn, plug);
			var repoPaths = grunt.file.expandFiles(plugDir + "/**/*");
			var i, j, file, newFile;

			grunt.helper("write", "Copying files into project".grey);

			var exclude = [
				"package.json",
				".gitignore",
				"README.md"
			];

			if (isUpdate) {
				exclude.push("**/__" + "PROJECT_NAME" + "__/**/*");
			}

			repoPaths.filter(function (file) {
				return !grunt.file.isMatch(exclude, file) && fs.existsSync(file);
			}).forEach(function (file) {
				newFile = file.replace(plug, path.join("../", scope)).replace(/\/\//g, "/");
				grunt.file.copy(file, newFile);

				grunt.log.write(".".grey);
			});

			var localFiles = "defaults";
			var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
			var localDir = path.join(pluginDir, plug, localFiles);

			if (fs.existsSync(localDir)) {
				var localPaths = grunt.file.expandFiles({
					dot : true
				}, localDir + "/**/*");

				localPaths.filter(function (file) {
					return !grunt.file.isMatch(exclude, file) && fs.existsSync(file);
				}).forEach(function (file) {
					newFile = file.replace(localDir + "/", "");
					grunt.file.copy(file, newFile);

					grunt.log.write(".".grey);
				});

				var gitIgnore = path.join(localDir, ".gitignore");
				if (fs.existsSync(gitIgnore)) {
					var currGitIgnore = path.join(cwd, ".gitignore");

					if (fs.existsSync(currGitIgnore)) {
						grunt.file.write(currGitIgnore, [
							grunt.file.read(currGitIgnore),
							grunt.file.read(gitIgnore)
						].join("\n"));
					} else {
						grunt.file.copy(gitIgnore, currGitIgnore);
					}

					grunt.log.write(".".grey);
				}
			}

			grunt.log.write("...".grey);
			grunt.log.ok();

			runInstaller(plug, plugPkg, cb);
		};

		var doReplacement = function (plug, plugPkg, cb) {
			var doReplacement = plugPkg.config.replaceVars;

			// Replace variables
			if (doReplacement) {
				var plugDir = path.join(cwd, pkg.config.dirs.robyn, plug);

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

		var cloneExternalRepo = function (plug, plugPkg, cb) {
			var plugRepo = plugPkg.repository;

			if (plugRepo) {
				var plugBranch = branch || plugRepo.branch || "master";
				var plugPath = path.join(cwd, pkg.config.dirs.robyn, plug);

				grunt.file.mkdir(plugPath);

				grunt.helper("spawn", {
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
			var callUpdate;
			var dep;
			var projectPkg = require(path.join(cwd, "package.json"));
			var pluginDeps = [];

			for (dep in plugPkg.dependencies) {
				if (!projectPkg.dependencies[dep] || projectPkg.dependencies[dep] !== plugPkg.dependencies[dep]) {
					projectPkg.dependencies[dep] = plugPkg.dependencies[dep];
					pluginDeps.push(dep + "@" + plugPkg.dependencies[dep]);

					callUpdate = true;
				}
			}

			for (dep in plugPkg.devDependencies) {
				if (!projectPkg.devDependencies[dep] || projectPkg.devDependencies[dep] !== plugPkg.devDependencies[dep]) {
					projectPkg.devDependencies[dep] = plugPkg.devDependencies[dep];
				}
			}

			grunt.file.write(path.join(cwd, "package.json"), JSON.stringify(projectPkg, null, "\t") + "\n");

			if (callUpdate) {
				grunt.helper("install_modules", pluginDeps, function () {
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

			pkg.save();
		};

		var findLocalPaths = function (plug, plugPkg, cb) {
			if (plugPkg.config.requiredPaths || plugPkg.config.excludedPaths) {
				savePaths(plugPkg);
			}

			installDependencies(plug, plugPkg, cb);
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

			findLocalPaths(plug, plugPkg, cb);
		};

		var checkSystemDependencies = function (plug, plugPkg, cb) {
			if (plugPkg && plugPkg.systemDependencies) {
				grunt.helper("check_dependencies", plugPkg, function () {
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

		if (!isUpdate && pkg.installedPlugins[plug]) {
			grunt.log.writeln("You've already installed %s!".yellow.replace("%s", plug));

			if (cb) {
				cb();
			}
			return;
		} else {
			installPlugin(plug, cb);
		}
	});

};
