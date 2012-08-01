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
		}];

		var child = cp.spawn("npm", ["install"], {
			env: null,
			setsid: true,
			stdio: "inherit"
		});

		child.addListener("exit", function (code) {

			grunt.helper("check_for_available_plugins", function (plugins) {
				var i, j, plugin;

				for (i = 0, j = plugins.length; i < j; i++) {
					plugin = plugins[i];

					options.push({
						name: plugin.id,
						description: plugin.description,
						message: "Would you like to include %s?".replace("%s", plugin.name),
						validator: /^y$|^n$/i,
						"default": "Y/n"
					});
				}

				grunt.helper("prompt", {}, options, function(err, props) {

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

					var name = props.name;
					var title = props.title;

					delete props.name;
					delete props.title;

					var plugArr = [];
					i = 0;

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

			});

		});
	});

};
