/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		output = path.join("project", "static"),
		source = path.join("project", "source");

	// Project configuration.
	grunt.config.set("webfont.caboose", {
		src: path.join(source, "icons", "**", "*.svg"),
		dest: path.join(output, "fonts"),
		destCss: path.join(source, "scss", "project", "fonts"),
		options: {
			stylesheet: "scss"
		}
	});

};
