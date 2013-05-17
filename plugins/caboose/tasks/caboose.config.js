/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		output = path.join("project", "static"),
		source = path.join("project", "source");

	// Config options
	grunt.config.set("compass.dev", {
		http_path: "/",
		sass_dir: path.join(source, "scss", "project"),
		css_dir: path.join(output, "css"),
		images_dir: path.join(source, "img"),
		fonts_dir: path.join(source, "fonts"),
		javascripts_dir: path.join(source, "js"),
		generated_images_dir: path.join(output, "img"),
		additional_import_paths: [path.join(source, "scss", "caboose")],
		sprite_load_path: [path.join(source, "img")],
		output_style: ":expanded",
		line_comments: true,
		relative_assets: true,

		// Runs compass via your project gem bundle
		bundle_exec: true,

		// Force compilation? If true, will regenerate everything, sprites included
		force_compile: false,

		// Clean cache before compile?
		clean: false,

		// Extra config options
		extras: {

			// Gems?
			// require: ["susy", "stitch"],

			// Additional import paths?
			// add_import_path: "",

			// Bust the cache?
			// asset_cache_buster: ":none"

		}

	});

	grunt.config.set("compass.prod", {
		http_path: "<%= compass.dev.http_path %>",
		sass_dir: "<%= compass.dev.sass_dir %>",
		css_dir: "<%= compass.dev.css_dir %>",
		images_dir: "<%= compass.dev.images_dir %>",
		fonts_dir: "<%= compass.dev.fonts_dir %>",
		javascripts_dir: "<%= compass.dev.javascripts_dir %>",
		generated_images_dir: "<%= compass.dev.generated_images_dir %>",
		additional_import_paths: "<%= compass.dev.additional_import_paths %>",
		sprite_load_path: "<%= compass.dev.sprite_load_path %>",
		output_style: ":compressed",
		line_comments: false,
		relative_assets: "<%= compass.dev.relative_assets %>",

		// Runs compass via your project gem bundle
		bundle_exec: "<%= compass.dev.bundle_exec %>",

		// Force compilation? If true, will regenerate everything, sprites included
		force_compile: "<%= compass.dev.force_compile %>",

		// Clean cache before compile?
		clean: true,
	});

};
