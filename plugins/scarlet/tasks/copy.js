/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
	var path = require('path');
	var paths = require('./utils/paths');

	var copy = grunt.config.get("copy");

	if (!copy) {
		return;
	}

	// By default, dev / prod are the same
	// Feel free to customize to your needs
	grunt.config.set("copy.admin", [
		{
			src: path.join(paths.source_path, "fonts"),
			dest: path.join(paths.static_path, "fonts")
		}, {
			src: path.join(paths.source_path, "js"),
			dest: path.join(paths.static_path, "js")
		}, {
			src: path.join(paths.source_path, "img"),
			dest: path.join(paths.static_path, "img")
		}
	]);

	grunt.config.set("watch.copy_admin", {
		files : grunt.config.get("copy").admin.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy:admin:soft"]
	});

	grunt.config.set("build.copy_admin", ["copy:admin"]);
};
