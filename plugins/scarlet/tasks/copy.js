/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
	var path = require("path");
	var paths = require("./utils/paths");

	// By default, dev / prod are the same
	// Feel free to customize to your needs
	grunt.config.set("copy.admin", [
		{
			src: path.join(paths.sourcePath, "fonts"),
			dest: path.join(paths.staticPath, "fonts")
		}, {
			src: path.join(paths.sourcePath, "js"),
			dest: path.join(paths.staticPath, "js")
		}, {
			src: path.join(paths.sourcePath, "img"),
			dest: path.join(paths.staticPath, "img")
		}
	]);

	grunt.config.set("watch.copy_admin", {
		files : grunt.config.get("copy").admin.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy:admin:soft"]
	});
};
