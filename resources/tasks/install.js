/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("install", "Install a plugin", function () {
		var pkg = require("./utils/pkg");
		var done = this.async();

		grunt.helper("check_initialized", function (initialized) {
			if (!initialized) {
				done(false);
			}
		});

		var plugArr = arguments;

		if (!plugArr.length) {
			grunt.helper("check_for_available_plugins", function (plugins) {
				grunt.log.writeln("");
				grunt.log.writeln("Install plugins with grunt install:my-plugin-name");

				var i, j, plugin;
				var available = [];
				var installed = [];

				for (i = 0, j = plugins.length; i < j; i++) {
					plugin = plugins[i];

					if (!pkg.config.installed_plugins[plugin]) {
						available.push(plugin);
					} else {
						installed.push(plugin);
					}
				}

				if (installed.length) {
					grunt.log.writeln("");
					grunt.log.writeln("[*]" + " Installed modules:".yellow);

					for (i = 0, j = installed.length; i < j; i++) {
						grunt.log.writeln("    " + installed[i].magenta);
					}
				}

				if (available.length) {
					grunt.log.writeln("");
					grunt.log.writeln("[*]" + " Available modules:".yellow);

					for (i = 0, j = available.length; i < j; i++) {
						grunt.log.writeln("    " + available[i].cyan);
					}
				}

				done();
			});
		} else {
			var i = 0;

			var tmpDir = ".rbp-temp";
			var fs = require("fs");
			var wrench = require("wrench");

			if (fs.existsSync(tmpDir)) {
				wrench.rmdirSyncRecursive(tmpDir, true);
			}

			grunt.file.mkdir(tmpDir);
			grunt.file.setBase(tmpDir);

			(function install (count) {
				if (!plugArr[count]) {
					return;
				}

				grunt.helper("install_plugin", plugArr[count], function (stop) {
					if (stop === true) {
						grunt.file.setBase("../");
						wrench.rmdirSyncRecursive(tmpDir, true);
						done(false);

						return;
					}

					count++;

					if (plugArr[count]) {
						install(count);
					} else {
						grunt.file.setBase("../");
						wrench.rmdirSyncRecursive(tmpDir, true);

						done();
					}
				});
			}(i));
		}
	});

};
