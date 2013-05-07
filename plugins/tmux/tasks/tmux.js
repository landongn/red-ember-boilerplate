/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("tmux", "Use tmux to spool up all available server / watch tasks", function () {
		var cp = require("child_process");

		var child = cp.spawn("bundle", [
			"exec",
			"tmuxinator",
			"start",
			grunt.template.process("<%= meta.projectName %>")
		], {
			stdio: "inherit"
		});
	});

};
