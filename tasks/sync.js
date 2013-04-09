/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	// Default task.
	grunt.registerTask("sync", "Sync your project with upstream changes", function () {
		var done = this.async();
		var pkg = require("./utils/pkg");

		grunt.helper("spawn", {
			cmd: "git",
			args: ["submodule", "update", pkg.config.dirs.robyn],
			title: "Syncing %s".replace("%s", pkg.name),
			complete: function (code) {
				if (code !== 0) {
					done(false);
				}

				grunt.config.set("synced", true);
				done();
			}
		});
	});

};
