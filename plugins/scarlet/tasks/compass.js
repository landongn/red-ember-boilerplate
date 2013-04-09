/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var paths = require("./utils/paths");
	var path = require("path");
	var fs = require("fs");

	var compass_path = path.join(paths.baseSource, "compass", "scss", "caboose");
	if (!fs.existsSync(exports.baseSource)) {
		compass_path = path.join(paths.baseSource, "scss", "caboose");
	}

	// Config options
	grunt.config.set("compass.admin", {
		http_path: "/",
		sass_dir: path.join(paths.sourcePathRel, "compass", "scss", "admin"),
		css_dir: path.join(paths.staticPathRel, "css"),
		images_dir: path.join(paths.staticPathRel, "img"),
		fonts_dir: path.join(paths.staticPathRel, "fonts"),
		javascripts_dir: path.join(paths.staticPathRel, "js"),
		additional_import_paths: [ compass_path ],
		output_style: ":compressed",
		line_comments: true,
		relative_assets: true,
		bundle_exec: true,
		force_compile: true
	});

	grunt.config.set("build.compass_admin", ["copy:admin", "compass:admin"]);
};
