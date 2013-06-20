/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		output = path.join("project", "static"),
		source = path.join("project", "source");

	// Config options
	grunt.config.set("caboose.dev", {
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

		// Runs caboose via your project gem bundle
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

	grunt.config.set("caboose.prod", {
		http_path: "<%= caboose.dev.http_path %>",
		sass_dir: "<%= caboose.dev.sass_dir %>",
		css_dir: "<%= caboose.dev.css_dir %>",
		images_dir: "<%= caboose.dev.images_dir %>",
		fonts_dir: "<%= caboose.dev.fonts_dir %>",
		javascripts_dir: "<%= caboose.dev.javascripts_dir %>",
		generated_images_dir: "<%= caboose.dev.generated_images_dir %>",
		additional_import_paths: "<%= caboose.dev.additional_import_paths %>",
		sprite_load_path: "<%= caboose.dev.sprite_load_path %>",
		output_style: ":compressed",
		line_comments: false,
		relative_assets: "<%= caboose.dev.relative_assets %>",

		// Runs caboose via your project gem bundle
		bundle_exec: "<%= caboose.dev.bundle_exec %>",

		// Force compilation? If true, will regenerate everything, sprites included
		force_compile: "<%= caboose.dev.force_compile %>",

		// Clean cache before compile?
		clean: true,

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

};
