/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerMultiTask("copy", "Copy source files to static dir.", function () {
		this.requiresConfig("copy");

		var fs = require("fs");
		var path = require("path");
		var cwd = process.cwd() + path.sep;

		var wrench = require("wrench");
		var files = this.data;

		for (var i = 0, j = files.length; i < j; i++) {
			var current = files[i].src;
			var dest = files[i].dest;

			if (fs.existsSync(current)) {
				grunt.helper("writeln", ("Copying " + current.replace(cwd, "") + " to " + dest.replace(cwd, "")).grey);
				wrench.copyDirSyncRecursive(current, dest);
			}
		}
	});

};
