/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		var fs = require("fs");
		var pkg = require("../utils/pkg");

		// Spacer
		grunt.log.writeln();
		grunt.log.writeln(("[!]".magenta + " Checking for available plugins.".grey).bold);
		grunt.log.writeln("    Pinging GitHub at %s".replace("%s", repo).grey);

		var pluginsDir = pkg.config.dirs.robin + "/components";

		if (fs.existsSync(pluginsDir)) {
			var branches = grunt.file.expandDirs(pluginsDir + "/*");
			var i, j, branch;

			console.log(branches);

			for (i = 0, j = branches.length; i < j; i++) {
				branch = branches[i];

				if (!fs.existsSync(branch + "/package.json")) {
					continue;
				}

				plugins.push(require(branch + "/package.json").name);
			}

			if (cb) {
				cb(plugins.sort());
			}
		} else if (cb) {
			cb([]);
		}
	});

};
