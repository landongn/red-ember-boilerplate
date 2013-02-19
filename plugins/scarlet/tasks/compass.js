/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
	var paths = require('./utils/paths');
	var path = require('path');

	// Config options
	grunt.config.set("compass.admin", {
		http_path: "/",
		sass_dir: path.join(paths.source_path_rel, "compass", "scss", "admin"),
		css_dir: path.join(paths.static_path_rel, "css"),
		images_dir: path.join(paths.static_path_rel, "img"),
		fonts_dir: path.join(paths.static_path_rel, "fonts"),
		javascripts_dir: path.join(paths.static_path_rel, "js"),
		additional_import_paths: [
			path.join(paths.base_source, "compass", "scss", "caboose")
		],
		output_style: ":compressed",
		line_comments: true,
		relative_assets: true,
		bundle_exec: true,
		force_compile: true
	});

	grunt.config.set("build.compass_admin", ['compass:admin']);
};
