/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var path = require("path");

	grunt.config.set("copy", {
		files: [{
			src: "project/source/local",
			dest: "project/static/local"
		}, {
			src: "project/source/fonts",
			dest: "project/static/fonts"
		}]
	});

	grunt.registerMultiTask("copy", "Copy source files to static dir.", function () {
		this.requiresConfig("copy");

		var fs = require("fs");
		var cwd = process.cwd();

		var wrench = require("wrench");
		var files = this.data;

		for (var i = 0, j = files.length; i < j; i++) {
			var current = files[i].src;
			var dest = files[i].dest;

			if (fs.existsSync(current)) {
				grunt.helper("writeln", ("Copying " + current + " to " + dest).grey);
				wrench.copyDirSyncRecursive(path.join(cwd, current), path.join(cwd, dest));
			}
		}
	});

	grunt.config.set("build.copy", ["copy"]);

	grunt.config.set("watch.copy", {
		files : grunt.config.get("copy").files.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy"]
	});

};
