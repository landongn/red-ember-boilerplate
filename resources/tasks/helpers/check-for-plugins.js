/*global module:false*/
var pkg = require("../utils/pkg");

module.exports = function (grunt) {

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		console.log("[!]".magenta + " Use grunt install:plugin to install.".grey);

		var installed = pkg.config.installed_plugins;

		if (pkg.config.installed_plugins.length) {
			console.log("");
			console.log("[!]".magenta + " Installed plugins:".grey);

			for (var key in installed) {
				console.log("    " + installed[key].yellow);
			}
		}
	});

};
