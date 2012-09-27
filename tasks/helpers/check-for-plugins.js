/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		var fs = require("fs");
		var pkg = require("../utils/pkg");
		var colors = require("colors");

		// Spacer
		grunt.log.writeln();
		grunt.log.writeln(("[!]".magenta + " Checking for available plugins.".grey).bold);

		var plugins = [];
		var pluginsDir = pkg.config.dirs.robin + "/components";

		if (fs.existsSync(pluginsDir)) {
			var branches = grunt.file.expandDirs(pluginsDir + "/*");
			var i, j, branch;

			for (i = 0, j = branches.length; i < j; i++) {
				branch = branches[i];

				if (!fs.existsSync(branch + "/package.json")) {
					continue;
				}

				var plugin = require(branch + "/package.json"),
					name = plugin.name;

				plugins.push(name);
			}

			grunt.log.writeln((plugins.join(", ")).grey);

			if (cb) {
				cb(plugins.sort());
			}
		} else if (cb) {
			cb([]);
		}
	});

};
