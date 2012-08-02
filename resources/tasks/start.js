/*global module:false*/

module.exports = function (grunt) {

	var fs = require("fs");
	var cp = require("child_process");

	grunt.registerTask("start", "Get your party started", function (useDefaults) {
		var done = this.async();
		var pkg = require("./utils/pkg");

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
		}, {
			name: "rosy",
			message: "Would you like to include Rosy?",
			validator: /^y$|^n$/i,
			"default": "Y/n"
		}, {
			name: "jshint",
			message: "Would you like to include JSHint?",
			validator: /^y$|^n$/i,
			"default": "Y/n"
		}, {
			name: "caboose",
			message: "Would you like to include Caboose?",
			validator: /^y$|^n$/i,
			"default": "Y/n"
		}, {
			name: "red-start",
			message: "Would you like to include RED Start?",
			validator: /^y$|^n$/i,
			"default": "Y/n"
		}, {
			name: "statix",
			message: "Would you like to include Statix?",
			validator: /^y$|^n$/i,
			"default": "Y/n"
		}];

		var removeBuiltIns = function () {
			var builtIns = [
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

		var promptForSettings = function (code) {
			grunt.helper("prompt", {}, options, function(err, props) {
				removeBuiltIns();

				var name = props.name;
				var title = props.title;

				delete props.name;
				delete props.title;

				var plugArr = [];
				var i = 0;

				for (var key in props) {
					var assert = grunt.helper("get_assertion", props[key]);

					if (assert) {
						plugArr.push(key);
					}
				}

				var tmpDir = ".rbp-temp";
				var wrench = require("wrench");

				if (fs.existsSync(tmpDir)) {
					wrench.rmdirSyncRecursive(tmpDir, true);
				}

				grunt.file.mkdir(tmpDir);
				grunt.file.setBase(tmpDir);

				grunt.helper("store_vars", name, title, function () {

					grunt.log.writeln("[*] " + "Stored and updated your project variables.".cyan);

					(function install (count) {
						if (!plugArr[count]) {
							return;
						}

						grunt.helper("install_plugin", plugArr[count], function (stop) {
							if (stop === true) {
								done(false);
								return;
							}

							count++;

							if (plugArr[count]) {
								install(count);
							} else {
								grunt.file.setBase("../");
								wrench.rmdirSyncRecursive(tmpDir, true);

								grunt.log.writeln("");
								grunt.log.writeln("[*] " + "All done! Commit you changes and you're on your way.".cyan);

								pkg.config.initialized = true;
								pkg.save();

								done();
							}
						});
					}(i));

				});
			});
		};

		var initializeRBP = function () {
			var child = cp.spawn("npm", ["install"], {
				env: null,
				setsid: true,
				stdio: "inherit"
			});

			child.addListener("exit", promptForSettings);
		};

		grunt.utils.spawn({
			cmd: "git",
			args: ["status"]
		}, function (err, result, code) {
			var unstaged = result.indexOf("Changes not staged for commit") !== -1;

			if (unstaged) {
				var prompt = require("prompt");
				prompt.message = "[!] WARNING:".yellow;
				prompt.delimiter = " ";

				prompt.start();

				prompt.get([{
					name: "unstaged",
					message: "There are unstaged files in your git repository. These may be overwritten. Are you sure you want to continue?".magenta,
					validator: /^y$|^n$/i,
					"default": "Y/n"
				}], function (err, props) {
					var assert = grunt.helper("get_assertion", props.unstaged);

					if (assert) {
						initializeRBP();
					} else {
						done(false);
					}
				});
			}
		});

	});

};
