/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		var fs = require("fs"),
			path = require("path"),
			cwd = process.cwd(),
			pkg = require("../utils/pkg"),
			pristinePkg = require(path.join(cwd, pkg.config.dirs.robyn, "package.json")),
			colors = require("colors");

		// Spacer
		grunt.log.writeln("[*]".grey + " Checking for available plugins.".grey);

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

			grunt.helper("writeln", ("Found the following: " + plugins.map(function (plug) {
				return plug.name;
			}).sort().join(", ")).grey);

			if (cb) {
				cb(plugins.sort(compare));
			}
		} else if (cb) {
			grunt.helper("writeln", "No plugins found".grey);
			cb([]);
		}
	});

};
