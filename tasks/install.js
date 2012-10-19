/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("install", "Install a plugin", function (plugin, isUpdate) {
		var pkg = require("./utils/pkg");
		var colors = require("colors");
		var done = this.async();

		grunt.helper("check_for_available_plugins", function (plugins) {
			var i, j, current;
			var available = [];
			var installed = [];
			var plug;

			for (i = 0, j = plugins.length; i < j; i++) {
				current = plugins[i];

				if (!pkg.installedPlugins[current.name]) {
					available.push(current);
				} else {
					plug = pkg.installedPlugins[current.name];
					plug.name = current.name;

					installed.push(plug);
				}
			}

			var logPlugins = function (filtered) {
				for (i = 0, j = filtered.length; i < j; i++) {
					plug = filtered[i];
					grunt.log.writeln("[+] ".grey + "%n %v".replace("%n", plug.name).replace("%v", plug.version || "").cyan + " (%d)".replace("%d", plug.description).grey);
				}
			};

			var showPlugins = function (showHelp) {
				var plug;

				if (showHelp) {
					grunt.log.writeln();
					grunt.log.writeln("Install plugins with grunt install:my-plugin-name");
				}

				grunt.log.writeln();
				grunt.log.writeln("[*] ".grey + "Installed plugins:".magenta);

				if (installed.length) {
					logPlugins(installed);
				} else {
					grunt.log.writeln("You haven't installed any plugins!".grey);
				}

				grunt.log.writeln();
				grunt.log.writeln("[*] ".grey + "Available plugins:".magenta);

				if (available.length) {
					logPlugins(available);
				} else {
					grunt.log.writeln("You've installed all available plugins!".grey);
				}
			};

			var resetGit = function (err) {
				var cp = require("child_process");

				var child = cp.spawn("git", ["reset", "--hard", "HEAD"], {
					cwd: pkg.config.dirs.robyn,
					stdio: "pipe"
				});

				child.on("exit", function () {
					done(err);
				});
			};

			if (!plugin) {
				showPlugins(true);
				done();
			}

			var cleanPlugin = plugin.split("@")[0];
			var plugNames = plugins.map(function (plug) {
				return plug.name;
			});

			if ((plugNames.indexOf(cleanPlugin) === -1) && (pkg && (cleanPlugin !== pkg.name))) {
				showPlugins();

				grunt.log.writeln();
				grunt.fail.warn(cleanPlugin.red.bold + " is not an available plugin".yellow);
			}

			grunt.helper("install_plugin", plugin, isUpdate, function (stop) {
				if (stop === true) {
					resetGit(false);
				} else {
					if (isUpdate) {
						var path = require("path");
						var updatePath = path.join(__dirname, "./utils/on-update");

						delete require.cache[updatePath + ".js"];

						var update = require(updatePath);
						update.run(function () {
							resetGit();
						});
					} else {
						resetGit();
					}
				}
			});
		});
	});

};
