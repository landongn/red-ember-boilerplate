/* jshint node: true */

module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		output = path.join("project", "static"),
		source = path.join("project", "source");

	grunt.config.set("watch.webfont", {
		files: path.join(source, "**", "*.{svg,eps}"),
		tasks: ["webfont"],
		options: {
			interrupt: true
		}
	});

	grunt.config.set("build.webfont", ["webfont"]);
	grunt.loadNpmTasks("grunt-webfont");

};
