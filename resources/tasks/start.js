/*global module:false*/

module.exports = function (grunt) {

	grunt.registerTask("start", "Get your party started", function (branch, everything) {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");

		var done = this.async();
		var pkg = require("./utils/pkg");
		var localPkg = require("./utils/local-pkg");

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

		var finalizeInstall = function () {
			var rbp = {
				name: pkg.name,
				version: pkg.version,
				repository: pkg.repository
			};

			pkg.save();

			pkg.name = pkg.config.vars.PROJECT_NAME;
			pkg.description = "";
			pkg.version = "0.0.0";

			var url = pkg.repository.url;
			pkg.repository.url = remote || "";

			rbp.repository.url = url;
			rbp.repository.branch = branch || "master";

			pkg.config.rbp = rbp;

			pkg.config.initialized = true;
			pkg.save();

			grunt.log.writeln();
			grunt.log.writeln("[*] " + "Run `grunt tasks` for a list of available tasks.".cyan);
			grunt.log.writeln("[*] " + "You should edit your package.json and fill in your project details.".cyan);
			grunt.log.writeln("[*] " + "All done! Commit you changes and you're on your way.".cyan);

			done();
		};

		var removeTmpDir = function (tmpDir) {
			var wrench = require("wrench");
			grunt.file.setBase("../");

			wrench.rmdirSyncRecursive(tmpDir, true);
		};

		var handleSettings = function(err, props) {
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

			grunt.helper("store_vars", name, title, function () {
				grunt.file.setBase(tmpDir);

				grunt.log.writeln("[*] " + "Stored and updated your project variables.".cyan);
				grunt.log.writeln();

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
							finalizeInstall();
						}
					});
				}(i));

			});
		};

		var promptForSettings = function (plugins) {
			var i, j, plugin,
				installed = pkg.config.installed_plugins;

			if (installed) {
				var plugTitle;

				for (var key in installed) {
					if (!plugTitle) {
						grunt.log.writeln();
						grunt.log.writeln("[*] ".cyan + "Installed RED Boilerplate plugins:".magenta);
						plugTitle = true;
					}

					var plug = installed[key];

					if (typeof plug !== "string") {
						grunt.log.writeln("[+] ".grey + "%n %v".replace("%n", key).replace("%v", plug.version).cyan + " (%d)".replace("%d", plug.description).grey);
					} else {
						grunt.log.writeln("[+] ".grey + key.cyan + " (%d)".replace("%d", plug).grey);
					}
				}
			}

			for (i = 0, j = plugins.length; i < j; i++) {
				plugin = plugins[i];

				if (!installed || !installed[plugin]) {
					options.push({
						name: plugin,
						message: "Would you like to include %s?".replace("%s", plugin),
						validator: /[y\/n]+/i,
						"default": "Y/n"
					});
				}
			}

			if (everything) {
				handleSettings(null, function () {
					var opts = {};

					for (i = 0, j = options.length; i < j; i++) {
						opts[options[i].name] = "y";
					}

					return opts;
				}());
			} else {
				grunt.helper("prompt", {}, options, handleSettings);
			}
		};

		var gatherPlugins = function () {
			grunt.helper("check_for_available_plugins", promptForSettings);
		};

		var handleRemote = function (err, props) {
			if (props.remote) {
				remote = props.remote;

				grunt.utils.spawn({
					cmd: "git",
					args: ["remote", "add", "origin", props.remote]
				}, gatherPlugins);
			} else {
				gatherPlugins();
			}
		};

		var addOrigin = function () {
			if (everything) {
				handleRemote(null, {
					remote : null
				});
			} else {
				prompt.start();

				prompt.get([{
					name: "remote",
					message: "Github repository url (This can be left blank)?",
					validator: /(^((git@)|(http(s)|git):\/\/)(.*)\.git$)|(^$)/,
					required: false,
					"default": null
				}], handleRemote);
			}
		};

		var handleInit = function (err, props) {
			var assert = grunt.helper("get_assertion", props.init);

			if (assert) {
				grunt.utils.spawn({
					cmd: "git",
					args: ["init"]
				}, addOrigin);
			} else {
				gatherPlugins();
			}
		};

		var initializeRBP = function (ungit) {
			if (ungit) {
				if (everything) {
					handleInit(null, {
						init : "y"
					});
				} else {
					prompt.start();

					prompt.get([{
						name: "init",
						message: "Would you like to create a git repository?".grey,
						validator: /[y\/n]+/i,
						"default": "Y/n"
					}], handleInit);
				}
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
					validator: /[y\/n]+/i,
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
				grunt.log.writeln();
				grunt.log.writeln("[*] " + "This party's already been started. You can install individual plugins with `grunt install`".cyan);
				grunt.log.writeln("[*] " + "Run `grunt tasks` for a list of available tasks.".cyan);

				done();
			} else {
				prompt = require("prompt");
				prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
				prompt.delimiter = prompt.delimter || " ";

				grunt.log.writeln();

				grunt.utils.spawn({
					cmd: "git",
					args: ["status"]
				}, checkGitInfo);
			}
		};

		var runInitializeScripts = function (i) {
			i = (i || 0);

			if (!pkg.scripts || !pkg.scripts.initialize || !pkg.scripts.initialize[i]) {
				return getThisPartyStarted();
			}

			var initScript = pkg.scripts.initialize[i];
			var args = initScript.split(" "),
				cmd = args.shift(),
				file = args.join("");

			if (cmd === "node" && fs.existsSync("./" + file)) {
				grunt.log.subhead(args);

				var initializer = require(fs.realpathSync(file));

				initializer.run(function (error) {
					if (error) {
						grunt.fail.warn(error);
					}

					runInitializeScripts(++i);
				});
			} else {
				runInitializeScripts(++i);
			}
		};

		var checkIfPartyStarted = function () {
			var local = localPkg.config,
				requiredPaths = local.requiredPaths,
				i, j, req;

			for (i = 0, j = requiredPaths.length; i < j; i++) {
				if (!fs.existsSync("./" + requiredPaths[i])) {
					local.installed = false;
				}
			}

			if (local.installed === true) {
				getThisPartyStarted();
			} else {
				local.installed = true;
				localPkg.config = local;

				localPkg.save();
				runInitializeScripts();
			}
		};

		var checkSystemDependencies = function (sysDeps) {
			if (sysDeps) {
				grunt.helper("check_dependencies", sysDeps, function (name) {
					checkIfPartyStarted();
				}, function (error) {
					done(error);
				});
			} else {
				checkIfPartyStarted();
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
