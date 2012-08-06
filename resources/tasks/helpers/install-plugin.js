/*global module:false*/
module.exports = function (grunt) {

	var fs = require("fs");
	var cp = require("child_process");
	var path = require("path");
	var pkg = require("../utils/pkg");

	grunt.registerHelper("install_plugin", function (plug, cb) {

		var completeInstall = function (plug, plugPkg, cb) {
			if (fs.existsSync("./install.js")) {
				fs.unlinkSync("install.js");
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
			var i, j, file, newFile;

			var exclude = [
				"package.json",
				".gitignore",
				"grunt.js",
				"README.md"
			];

			for (i = 0, j = repoPaths.length; i < j; i++) {
				file = repoPaths[i];

				if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
					newFile = file.replace(plug, path.join("../", scope)).replace(/\/\//g, "/");

					grunt.log.writeln(("    Writing " + newFile.replace("../", "")).grey);
					grunt.file.copy(file, newFile);
				}
			}

			wrench.rmdirSyncRecursive(plug, true);

			if (plug !== "master") {
				var plugPaths = grunt.file.expandFiles("**/*");

				for (i = 0, j = plugPaths.length; i < j; i++) {
					file = plugPaths[i];

					if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
						grunt.log.writeln(("    Writing " + file).grey);
						grunt.file.copy(file, path.join("../", file));
					}
				}
			}

			doReplacement(plug, plugPkg, cb);
		};

		var installDependencies = function (plug, plugPkg, cb) {
			var callInstall;

			for (var dep in plugPkg.dependencies) {
				if (!pkg.dependencies[dep] || pkg.dependencies[dep] !== plugPkg.dependencies[dep]) {
					pkg.dependencies[dep] = plugPkg.dependencies[dep];
					callInstall = true;
				}
			}

			if (plug !== "master") {
				pkg.config.installed_plugins[plug] = plugPkg.description;
				pkg.save();
			}

			if (callInstall) {
				var child = cp.spawn("npm", ["install"], {
					cwd: "../",
					env: null,
					setsid: true,
					stdio: "inherit"
				});

				child.addListener("exit", function () {
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
				args: ["checkout", "-f", plugPath]
			}, function (err, result, code) {
				var plugPkg = grunt.file.readJSON("./package.json");
				var pkgRepo = pkg.repository;
				var plugRepo = plugPkg.repository;

				var action = " " + (plug === "master" ? "Updating" : "Installing") + " ";
				var source = (plugRepo ? plugRepo.url : plugPath);

				grunt.log.writeln("");
				grunt.log.writeln(("[!]".magenta + (action + plugPkg.name + " from " + source).grey).bold);

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
			grunt.log.writeln(("You've already installed " + plug + "! Remove the reference from package.json (config.installed_modules) to reinstall.").yellow);

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
