/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		caboose = require(path.join(__dirname, "../plugin.json")),
		source = path.join(caboose.config.scope, "img"),
		output = path.join("project/static/img");

	grunt.config.set("img", {
		dev : {
			src: path.join(output, "**", "*.{png,jpeg,jpg}")
		},

		prod: {
			src: path.join(output, "**", "*.{png,jpeg,jpg}")
		}
	});

	grunt.registerTask("img:prebuild", function () {
		var done = this.async();
		var wrench = require("wrench");

		// Remove old files
		wrench.copyDirSyncRecursive(source, output);
		done();
	});

	grunt.config.set("watch.img", {
		files : [path.join(source, "**/*.{gif,png,jpeg,jpg}")],
		tasks : ["img:prebuild"]
	});

	grunt.config.set("build.img", ["img:prebuild", "img:prod"]);

	// Load task
	grunt.loadNpmTasks("grunt-img");
};
