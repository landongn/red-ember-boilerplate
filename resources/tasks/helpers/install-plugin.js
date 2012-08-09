/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("install_plugin", function (plug, cb) {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");
		var pkg = require("../utils/pkg");

		var isRBP = (plug.indexOf("red-boilerplate") !== -1);

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

					var child = cp.spawn(args.shift(), args, {
						env: null,
						setsid: true
					});

					process.stdin.resume();

					process.stdin.pipe(child);
					child.stdout.pipe(process.stdout);

					child.addListener("exit", function (code) {
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

			if (isRBP) {
				exclude.push("**/project/**/*");
			}

			for (i = 0, j = repoPaths.length; i < j; i++) {
				file = repoPaths[i];

				if (!grunt.file.isMatch(exclude, file) && fs.existsSync(file)) {
					newFile = file.replace(plug, path.join("../", scope)).replace(/\/\//g, "/");

					grunt.log.writeln(("    Writing " + newFile.replace("../", "")).grey);
					grunt.file.copy(file, newFile);
				}
			}

			wrench.rmdirSyncRecursive(plug, true);

			if (!isRBP) {
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
			var callUpdate;

			for (var dep in plugPkg.dependencies) {
				if (!pkg.dependencies[dep] || pkg.dependencies[dep] !== plugPkg.dependencies[dep]) {
					pkg.dependencies[dep] = plugPkg.dependencies[dep];
					callUpdate = true;
				}
			}

			if (!isRBP) {
				var plugInitScript = plugPkg.scripts && plugPkg.scripts.initialize ? plugPkg.scripts.initialize : null;

				if (plugInitScript) {
					pkg.scripts = pkg.scripts || {};
					pkg.scripts.install = pkg.scripts.install ? [pkg.scripts.install, plugInitScript].join("; ") : plugInitScript;
				}

				pkg.config.installed_plugins[plug] = plugPkg.description;
				pkg.save();
			}

			if (callUpdate) {
				var child = cp.spawn("npm", ["update"], {
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

				var p = (isRBP && plugPkg.config.rbp) ? plugPkg.config.rbp : plugPkg;

				var plugRepo = p.repository;

				var action = " " + (isRBP ? "Updating" : "Installing") + " ";
				var source = (plugRepo ? plugRepo.url : plugPath);

				grunt.log.writeln("");
				grunt.log.writeln(("[!]".magenta + (action + p.name + " from " + source).grey).bold);

				if (plugRepo) {
					var plugBranch = plugRepo.branch || "master";
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

		var initialize = function () {
			var p = (isRBP && pkg.config.rbp) ? pkg.config.rbp : pkg;
			var branchOverride = (isRBP) ? plug.split("@")[1] : null;

			grunt.utils.spawn({
				cmd: "git",
				args: ["init"]
			}, function (err, result, code) {
				setGitRemoteRef({
					name : p.name,
					branch : branchOverride || p.repository.branch,
					repo : p.repository.url
				}, function () {
					continueInstallPlugin(plug, cb);
				});
			});
		};

		if (pkg.config.installed_plugins[plug]) {
			var prompt = require("prompt");
			prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
			prompt.delimiter = prompt.delimter || " ";

			prompt.start();

			prompt.get([{
				name: "force",
				message: "WARNING: ".yellow + "You've already installed ".magenta + plug + "! All associated files will be overwritten. Are you sure you want to continue?".magenta,
				validator: /^y$|^n$/i,
				"default": "Y/n"
			}], function (err, props) {
				var assert = grunt.helper("get_assertion", props.force);

				if (assert) {
					initialize();
				} else {
					if (cb) {
						cb(true);
					}
				}
			});
			return;
		} else {
			initialize();
		}
	});

};
