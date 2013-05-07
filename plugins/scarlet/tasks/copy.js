/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
	var path = require("path");
	var paths = require("./utils/paths");

	// By default, dev / prod are the same
	// Feel free to customize to your needs
	grunt.config.set("copy.admin", [{
		src: path.join(paths.sourcePath, "fonts"),
		dest: path.join(paths.staticPath, "fonts")
	}, {
		src: path.join(paths.sourcePath, "img"),
		dest: path.join(paths.staticPath, "img")
	}]);
};
