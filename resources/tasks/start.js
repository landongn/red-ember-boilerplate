/*global module:false*/

module.exports = function (grunt) {

	grunt.registerTask("start", "Get your party started", function (branch) {
		var fs = require("fs");
		var cp = require("child_process");

		var done = this.async();
		var pkg = require("./utils/pkg");

		var whitelist = [];

		var prompt;
		var remote;

		var projectName = pkg.config.vars.PROJECT_NAME;
		var projectTitle = pkg.config.vars.PROJECT_TITLE;

		var options = [{
			name: "name",
			message: "Project name?",
			validator: /^([a-z]+)(\w+)$/,
			warning: "Invalid namespace. Valid characters are [a-Z]. Must start with a lowercase",
			"default": projectName || "sampleProjectName"
		}, {
			name: "title",
			message: "Project title?",
			"default": projectTitle || "Sample Project Title"
		}];

		var removeBuiltIns = function () {
			var builtIns = [
				"init",
				"concat",
				"min",
				"qunit",
				"server",
				"test"
			];

			var path;

			for (var i = 0, j = builtIns.length; i < j; i++) {
				path = "node_modules/grunt/tasks/" + builtIns[i] + ".js";

				if (fs.existsSync("./" + path)) {
					fs.unlinkSync(path);
				}
			}
		};

		var finalizeInstall = function () {
			grunt.log.writeln("[*] " + "All done! Commit you changes and you're on your way.".cyan);

			var rbp = {
				name: pkg.name,
				version: pkg.version,
				repository: pkg.repository
			};

			pkg.save();

			pkg.name = pkg.config.vars.PROJECT_NAME;
			pkg.version = "0.0.0";

			var url = pkg.repository.url;
			pkg.repository.url = remote || "";

			rbp.repository.url = url;
			rbp.repository.branch = branch || "master";

			pkg.config.rbp = rbp;

			pkg.config.initialized = true;
			pkg.save();

			done();
		};

		var showAvailableTasks = function () {
			grunt.log.writeln("");
			grunt.log.writeln("[*] " + "Run `grunt tasks` for a list of available tasks.".cyan);

			grunt.task.run("tasks");
			finalizeInstall();
		};

		var promptForSettings = function (plugins) {
			var i, j, plugin;

			for (i = 0, j = plugins.length; i < j; i++) {
				plugin = plugins[i];

				options.push({
					name: plugin,
					message: "Would you like to include %s?".replace("%s", plugin),
					validator: /^y$|^n$/i,
					"default": "Y/n"
				});
			}

			var removeTmpDir = function (tmpDir) {
				var wrench = require("wrench");
				grunt.file.setBase("../");

				wrench.rmdirSyncRecursive(tmpDir, true);
			};

			grunt.helper("prompt", {}, options, function(err, props) {
				removeBuiltIns();

				var name = props.name;
				var title = props.title;

				delete props.name;
				delete props.title;

				var plugArr = whitelist;
				var i = 0;

				for (var key in props) {
					var assert = grunt.helper("get_assertion", props[key]);

					if (assert) {
						plugArr.push(key);
					}
				}

				// Sort by name
				plugArr = plugArr.sort();

				var tmpDir = ".rbp-temp";

				if (!fs.existsSync(tmpDir)) {
					grunt.file.mkdir(tmpDir);
				}

				grunt.file.setBase(tmpDir);

				grunt.helper("store_vars", name, title, function () {

					grunt.log.writeln("[*] " + "Stored and updated your project variables.".cyan);

					(function install (count) {
						if (!plugArr[count]) {
							removeTmpDir(tmpDir);
							finalizeInstall();
							return;
						}

						grunt.helper("install_plugin", plugArr[count], null, function (stop) {
							if (stop === true) {
								removeTmpDir(tmpDir);
								done(false);
								return;
							}

							count++;

							if (plugArr[count]) {
								install(count);
							} else {
								removeTmpDir(tmpDir);
								showAvailableTasks();
							}
						});
					}(i));

				});
			});
		};

		var gatherPlugins = function () {
			grunt.helper("check_for_available_plugins", promptForSettings);
		};

		var addOrigin = function () {
			prompt.start();

			prompt.get([{
				name: "remote",
				message: "Github repository url (This can be left blank)?",
				validator: /(^((git@)|(http(s)|git):\/\/)(.*)\.git$)|(^$)/,
				required: false,
				"default": null
			}], function (err, props) {
				if (props.remote) {
					remote = props.remote;

					grunt.utils.spawn({
						cmd: "git",
						args: ["remote", "add", "origin", props.remote]
					}, gatherPlugins);
				} else {
					gatherPlugins();
				}
			});
		};

		var initializeRBP = function (ungit) {
			if (ungit) {
				prompt.start();

				prompt.get([{
					name: "init",
					message: "Would you like to create a git repository?".grey,
					validator: /^y$|^n$/i,
					"default": "Y/n"
				}], function (err, props) {
					var assert = grunt.helper("get_assertion", props.init);

					if (assert) {
						grunt.utils.spawn({
							cmd: "git",
							args: ["init"]
						}, addOrigin);
					} else {
						gatherPlugins();
					}
				});
			} else {
				gatherPlugins();
			}
		};

		var checkGitInfo = function (err, result, code) {
			var unstaged = result.indexOf("Untracked files:") !== -1;
			var ungit = result.indexOf("fatal: Not a git repository") !== -1;

			if (unstaged) {
				prompt.start();

				prompt.get([{
					name: "unstaged",
					message: "WARNING: ".yellow + "There are unstaged files in your git repository. These may be overwritten. Are you sure you want to continue?".magenta,
					validator: /^y$|^n$/i,
					"default": "Y/n"
				}], function (err, props) {
					var assert = grunt.helper("get_assertion", props.unstaged);

					if (assert) {
						initializeRBP(ungit);
					} else {
						done(false);
					}
				});
			} else {
				initializeRBP(ungit);
			}
		};

		var getThisPartyStarted = function () {
			if (pkg.config.initialized) {
				grunt.log.writeln("[*] " + "This party's already been started. You can install individual plugins with `grunt install`".cyan);
				done();
			} else {
				prompt = require("prompt");
				prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
				prompt.delimiter = prompt.delimter || " ";

				grunt.log.writeln("");

				grunt.utils.spawn({
					cmd: "git",
					args: ["status"]
				}, checkGitInfo);
			}
		};

		var checkSystemDependencies = function (sysDeps) {
			if (sysDeps) {
				grunt.helper("check_dependencies", sysDeps, function (name) {
					getThisPartyStarted();
				}, function (error) {
					done(error);
				});
			} else {
				getThisPartyStarted();
			}
		};

		var installNPMModules = function () {
			var child = cp.spawn("npm", ["install", "--production"], {
				env: null,
				setsid: true,
				stdio: "inherit"
			});

			child.addListener("exit", function () {
				checkSystemDependencies(pkg.systemDependencies);
			});
		};

		(function () {
			installNPMModules();
		}());

	});

};
