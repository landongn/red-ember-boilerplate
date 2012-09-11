/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("install_plugin", function (plug, isUpdate, cb) {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");
		var pkg = require("../utils/pkg");

		var isRBP = (plug.indexOf("red-boilerplate") !== -1);
		var branchOverride = plug.split("@");

		if (branchOverride.length) {
			plug = branchOverride[0];
			branchOverride = branchOverride[1];
		}

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

		var updatePackageJSON = function (plug) {
			var json = "./" + plug + "/package.json";

			if (!fs.existsSync(json)) {
				return;
			}

			var rbp = pkg.config.rbp;
			var rbpPkg = grunt.file.readJSON(json);
			var props = ["name", "version", "repository"];
			var prop, curr;

			for (i = 0, j = props.length; i < j; i++) {
				prop = props[i];
				curr = rbpPkg[prop];

				if (typeof curr === "string") {
					rbp[prop] = curr;
				} else {
					for (var key in curr) {
						rbp[prop][key] = curr[key];
					}
				}
			}

			pkg.save();
		};

		var copyFiles = function (plug, plugPkg, cb) {
			var wrench = require("wrench");
			var scope = (plugPkg.config || {}).scope || "";
			var repoPaths = grunt.file.expandFiles("./" + plug + "/**/*");
			var i, j, file, newFile;

			var exclude = [
				"package.json",
				".gitignore",
				"README.md"
			];

			if (isUpdate) {
				exclude.push("**/__" + "PROJECT_NAME" + "__/**/*");
			}

			if (isRBP) {
				updatePackageJSON(plug);
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
			var dep;

			for (dep in plugPkg.dependencies) {
				if (!pkg.dependencies[dep] || pkg.dependencies[dep] !== plugPkg.dependencies[dep]) {
					pkg.dependencies[dep] = plugPkg.dependencies[dep];
					callUpdate = true;
				}
			}

			for (dep in plugPkg.devDependencies) {
				if (!pkg.devDependencies[dep] || pkg.devDependencies[dep] !== plugPkg.devDependencies[dep]) {
					pkg.devDependencies[dep] = plugPkg.devDependencies[dep];
					callUpdate = true;
				}
			}

			if (!isRBP) {
				var plugInitScript = plugPkg.scripts && plugPkg.scripts.initialize ? plugPkg.scripts.initialize : null;

				var plugSrc = "./" + plug + "/package.json";
				var plugSrcPkg, initialize;

				if (plugInitScript) {
					pkg.scripts = pkg.scripts || {};
					initialize = pkg.scripts.initialize;

					if (initialize && initialize.length) {
						if (initialize.indexOf(plugInitScript) === -1) {
							pkg.scripts.initialize.push(plugInitScript);
						}
					} else {
						pkg.scripts.initialize = [plugInitScript];
					}
				}

				if (fs.existsSync(plugSrc)) {
					plugSrcPkg = grunt.file.readJSON(plugSrc);

					plugPkg.name = plugSrcPkg.name || plugPkg.name;
					plugPkg.version = plugSrcPkg.version || plugPkg.version;
					plugPkg.description = plugSrcPkg.description || plugPkg.description;
				}

				pkg.config.installed_plugins[plug] = {
					name : plugPkg.name,
					version : plugPkg.version,
					description : plugPkg.description
				};

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

		var continueInstallPlugin = function (plug, cb) {
			var plugPath = "plugins/" + plug;

			grunt.utils.spawn({
				cmd: "git",
				args: ["checkout", "-f", plugPath]
			}, function (err, result, code) {
				var plugPkg = grunt.file.readJSON("./package.json");

				var p = (plugPkg.config && plugPkg.config.rbp) ? plugPkg.config.rbp : plugPkg;

				var plugRepo = p.repository;

				var action = " " + (isRBP ? "Updating" : "Installing") + " ";
				var source = (plugRepo ? plugRepo.url : plugPath);

				grunt.log.writeln("");
				grunt.log.writeln(("[!]".magenta + (action + p.name + " from " + source).grey).bold);

				if (plugRepo) {
					var plugBranch = branchOverride || plugRepo.branch || "master";
					grunt.file.mkdir(plug);

					grunt.utils.spawn({
						cmd: "git",
						args: ["clone", "--branch", plugBranch, plugRepo.url, plug]
					}, function (err, result, code) {
						checkSystemDependencies(plug, plugPkg, cb);
					});
				} else {
					checkSystemDependencies(plug, plugPkg, cb);
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
			var p = (pkg.config && pkg.config.rbp) ? pkg.config.rbp : pkg;

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

		if (!isUpdate && pkg.config.installed_plugins[plug]) {
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
