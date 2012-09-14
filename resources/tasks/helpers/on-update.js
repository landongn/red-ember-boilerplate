/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("on_update", function (cb) {
		var fs = require("fs");
		var pkg = require("../utils/pkg");
		var path = require("path");

		function rename(obj, origVal, newVal) {
			pkg.config[newVal] = {};

			for (var key in pkg.config[origVal]) {
				pkg.config[newVal][key] = pkg.config[origVal][key];
			}

			delete pkg.config[origVal];
		}

		// 2.5.0
		(function () {

			// resources/helpers/check-dependency.js -> resources/helpers/check-dependencies.js
			var oldFile = path.join(__dirname, "check-dependency.js");

			if (fs.existsSync(oldFile)) {
				fs.unlinkSync(oldFile);
			}
		}());

		// 2.6.0
		(function () {
			if (pkg.config) {

				// pkg.config.rbp -> pkg.config.org
				if ("rbp" in pkg.config) {
					rename(pkg.config, "rbp", "org");
				}

				// pkg.config.installed_plugins -> pkg.config.installedPlugins
				if ("installed_plugins" in pkg.config) {
					rename(pkg.config, "installed_plugins", "installedPlugins");
				}

			}
		}());

		if (cb) {
			cb();
		}
	});

};
