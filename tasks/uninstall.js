/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("uninstall", "Remove a previously installed plugin", function (plugin) {
		var fs = require("fs");
		var pkg = require("./utils/pkg");
		var path = require("path");
		var colors = require("colors");

		var done = this.async();

		grunt.helper("check_for_available_plugins", function (plugins) {
			var i, j, current;
			var installed = [];
			var plug;

			for (i = 0, j = plugins.length; i < j; i++) {
				current = plugins[i];

				if (pkg.installedPlugins[current.name]) {
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
					grunt.log.writeln("Remove plugins with `grunt remove:my-plugin-name`");
				}

				grunt.log.writeln();
				grunt.log.writeln("[*] ".grey + "Installed plugins:".magenta);

				if (installed.length) {
					logPlugins(installed);
				} else {
					grunt.log.writeln("You haven't installed any plugins!".grey);
				}
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

			grunt.log.writeln();
			grunt.log.writeln(("[x] Removing " + plugin).red);

			if (pkg.installedPlugins[plugin]) {
				grunt.log.writeln("    Removing from installed plugins".grey);
				delete pkg.installedPlugins[plugin];
			}

			if (pkg.systemDependencies[plugin]) {
				grunt.log.writeln("    Removing associated system dependencies".grey);
				delete pkg.systemDependencies[plugin];
			}

			var plugDir = path.join(pkg.config.dirs.robyn, "plugins", plugin);

			if (fs.existsSync(plugDir)) {
				var plugPath = path.join(plugDir, "plugin.json");

				if (fs.existsSync(plugPath)) {
					var plugPkg = require(plugPath);

					var pkgScripts = pkg.scripts;
					var plugScripts = plugPkg.scripts;

					grunt.log.writeln("    Removing install/update scripts".grey);

					for (var key in plugScripts) {
						var absPath = path.join(plugDir, plugScripts[key]);

						for (var type in pkgScripts) {
							var index = pkgScripts[type].indexOf(absPath);

							if (index !== -1) {
								pkgScripts[type].splice(index, 1);
							}
						}
					}
				}
			}

			pkg.save();
			grunt.log.writeln(("[!] " + "Done removing " + plugin + ". Please commit the resulting changes.").yellow);

			done();
		});
	});

};
