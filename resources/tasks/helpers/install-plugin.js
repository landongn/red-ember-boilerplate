/*global module:false*/
module.exports = function (grunt) {

	var fs = require("fs");
	var path = require("path");
	var pkg = require("../utils/pkg");

	grunt.registerHelper("install_plugin", function (plug, cb) {

		var completeInstall = function (plug, plugPkg, cb) {
			if (fs.existsSync("./install.js")) {
				fs.unlinkSync("install.js");
			}

			if (fs.existsSync("./dependencies.json")) {
				fs.unlinkSync("dependencies.json");
			}

			grunt.file.setBase(".rbp-temp");

			if (cb) {
				cb();
			}
		};

		var doReplacement = function (plug, plugPkg, cb) {
			grunt.file.setBase("../");

			// Replace variables
			grunt.helper("replace_in_files", function () {
				var install = (plugPkg.scripts || {}).install;

				if (install) {
					var args = install.split(" ");

					grunt.utils.spawn({
						cmd: args.shift(),
						args: args
					}, function (err, result, code) {
						grunt.log.writeln(result);
						completeInstall(plug, plugPkg, cb);
					});
				} else {
					completeInstall(plug, plugPkg, cb);
				}
			});
		};

		var copyFiles = function (plug, plugPkg, cb) {
			var wrench = require("wrench");
			var scope = (plugPkg.config || {}).scope || "";
			var repoPaths = grunt.file.expandFiles("./" + plug + "/**/*");
			var i, j, file;

			var exclude = [
				"package.json",
				".gitignore",
				"grunt.js",
				"README.md"
			];

			for (i = 0, j = repoPaths.length; i < j; i++) {
				file = repoPaths[i];

				if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
					grunt.log.writeln(("    Writing " + file.replace(plug, scope)).grey);
					grunt.file.copy(file, file.replace(plug, path.join("../", scope)));
				}
			}

			wrench.rmdirSyncRecursive(plug, true);

			var plugPaths = grunt.file.expandFiles("**/*");

			for (i = 0, j = plugPaths.length; i < j; i++) {
				file = plugPaths[i];

				if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
					grunt.log.writeln(("    Writing " + file).grey);
					grunt.file.copy(file, path.join("../", file));
				}
			}

			doReplacement(plug, plugPkg, cb);
		};

		var installDependencies = function (plug, plugPkg, cb) {
			var callInstall;

			for (var dep in plugPkg.dependencies) {
				if (!pkg.dependencies[dep]) {
					pkg.dependencies[dep] = plugPkg.dependencies[dep];
					callInstall = true;
				}
			}

			pkg.config.installed_plugins[plug] = plugPkg;
			pkg.save();

			if (callInstall) {
				grunt.utils.spawn({
					cmd: "npm",
					args: ["install"]
				}, function (err, result, code) {
					copyFiles(plug, plugPkg, cb);
				});

				return;
			} else {
				copyFiles(plug, plugPkg, cb);
			}
		};

		var continueInstallPlugin = function (plug, cb) {
			var plugPath = "plugins/" + plug;

			grunt.utils.spawn({
				cmd: "git",
				args: ["checkout", plugPath]
			}, function (err, result, code) {
				var plugPkg = grunt.file.readJSON("./dependencies.json");
				var pkgRepo = pkg.repository;
				var plugRepo = plugPkg.repository;

				grunt.log.writeln("");
				grunt.log.writeln(("[!]".magenta + (" Installing " + plugPkg.name + " from " + (plugRepo ? plugRepo.url : plugPath)).grey).bold);

				if (plugRepo) {
					var plugBranch = plugRepo.branch || pkgRepo.branch || "master";
					grunt.file.mkdir(plug);

					grunt.utils.spawn({
						cmd: "git",
						args: ["clone", "--branch", plugBranch, plugRepo.url, plug]
					}, function (err, result, code) {
						installDependencies(plug, plugPkg, cb);
					});
				} else {
					installDependencies(plug, plugPkg, cb);
				}
			});
		};

		var setGitRemoteRef = function (options, cb) {
			// Check for remote, add if not found
			var name   = options.name,
				branch = options.branch || "master",
				repo = options.repo;

			grunt.utils.spawn({
				cmd: "git",
				args: ["remote", "show"]
			}, function (err, result, code) {
				var exists = (result.indexOf(pkg.name) !== -1);

				if (exists) {
					if (cb) {
						cb();
					}
				} else {
					grunt.log.writeln("[!]".magenta + (" Grabbing the RED Boilerplate from " + repo).grey);

					grunt.utils.spawn({
						cmd: "git",
						args : ["remote", "add", "--fetch", "--no-tags", name, repo]
					}, function (err, result, code) {
						grunt.utils.spawn({
							cmd: "git",
							args: ["pull", name, branch]
						}, function () {
							if (cb) {
								cb();
							}
						});
					});
				}
			});
		};

		if (pkg.config.installed_plugins[plug]) {
			grunt.log.writeln(("You've already installed " + pkg.config.installed_plugins[plug].name + "!").yellow);

			if (cb) {
				cb();
			}
			return;
		}

		grunt.utils.spawn({
			cmd: "git",
			args: ["init"]
		}, function (err, result, code) {
			setGitRemoteRef({
				name : pkg.name,
				branch : pkg.repository.branch,
				repo : pkg.repository.url
			}, function () {
				continueInstallPlugin(plug, cb);
			});
		});
	});

};
