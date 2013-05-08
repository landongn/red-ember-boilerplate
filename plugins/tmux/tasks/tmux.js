/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("tmux", "Use tmux to spool up all available server / watch tasks", function () {
		var done = this.async();
		var cp = require("child_process");
		var args = [
			"bundle", "exec",
			"tmuxinator", "start",
			grunt.template.process("<%= meta.projectName %>")
		];

		cp.exec(args.join(" "), done);
	});

};
