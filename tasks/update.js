/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var done = this.async();

		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.repository = pkg.repository || {};

		// Set plugin if not deflined
		plugin = plugin || pkg.name;

		var branch;
		var bits = plugin.split("@");

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		var robynBranch = pkg.repository.branch || "master";
		grunt.helper("spawn", {
			cmd: "git",
			args: ["submodule", "foreach", "git", "pull", "origin", robynBranch],
			title: "Updating %s".replace("%s", pkg.config.dirs.robyn),
			complete: function (code) {
				if (code !== 0) {
					done(false);
				}

				if (plugin !== pkg.name) {
					branch = branch || "master";
					grunt.task.run("install:%p@%b:update".replace("%p", plugin).replace("%b", branch));
				}

				done();
			}
		});
	});

};
