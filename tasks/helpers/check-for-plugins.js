/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		var fs = require("fs"),
			path = require("path"),
			cwd = process.cwd(),
			pkg = require("../utils/pkg"),
			pristinePkg = require(path.join(cwd, pkg.config.dirs.robyn, "package.json")),
			colors = require("colors");

		// Spacer
		grunt.log.writeln();
		grunt.log.writeln(("[!]".magenta + " Checking for available plugins.".grey).bold);

		var plugins = [];
		var pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);

		function compare(a, b) {
			if (a.name < b.name) {
				return -1;
			}

			if (a.name > b.name) {
				return 1;
			}

			return 0;
		}

		if (fs.existsSync(pluginDir)) {
			var branches = grunt.file.expandDirs(pluginDir + "/*");
			var i, j, branch, branchPath;

			for (i = 0, j = branches.length; i < j; i++) {
				branch = branches[i];
				branchPath = path.join(branch, "plugin.json");

				if (!fs.existsSync(branchPath)) {
					continue;
				}

				var plugin = require(branchPath),
					name = plugin.name;

				plugins.push(plugin);
			}

			if (cb) {
				cb(plugins.sort(compare));
			}
		} else if (cb) {
			cb([]);
		}
	});

};
