/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path");

	grunt.config.set("copy.prod", [{
		src: "project/source/local",
		dest: "project/static/local"
	}, {
		src: "project/source/fonts",
		dest: "project/static/fonts"
	}, {
		src: "project/source/img",
		dest: "project/static/img"
	}]);

	grunt.config.set("build.copy", ["copy"]);
};
