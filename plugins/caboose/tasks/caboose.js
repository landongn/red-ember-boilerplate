/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		caboose = require(path.join(__dirname, "..", "plugin.json")),
		output = path.join("project", "static"),
		source = caboose.config.scope;

	// Config options
	grunt.config.set("compass.dev", {
		http_path: "/",
		sass_dir: path.join(source, "scss", "project"),
		css_dir: path.join(output, "css"),
		images_dir: path.join(output, "img"),
		fonts_dir: path.join(output, "fonts"),
		javascripts_dir: path.join(output, "js"),
		generated_images_dir: path.join(output, "img"),
		additional_import_paths: [path.join(source, "scss", "caboose")],
		sprite_load_path: [path.join(source, "img")],
		output_style: ":expanded",
		line_comments: true,
		relative_assets: true,
		bundle_exec: true,

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
		bundle_exec: "<%= compass.dev.bundle_exec %>"
	});

	grunt.registerTask("compass:bundle", function () {
		var done = this.async();
		var cp = require("child_process");

		var child = cp.spawn("bundle", ["check"], {
			stdio: grunt.option("quiet") ? "pipe" : "inherit"
		});

		child.on("exit", function (code) {
			if (code !== 0) {
				if (!grunt.option("quiet")) {
					grunt.log.writeln();
					grunt.log.writeln("Installing missing gems...");
				}

				child = cp.spawn("bundle", ["install"], {
					stdio: grunt.option("quiet") ? "pipe" : "inherit"
				});

				child.on("exit", function (code) {
					if (code !== 0) {
						done(false);
					} else {
						done();
					}
				});
			} else {
				done();
			}
		});
	});

	grunt.config.set("watch.compass", {
		files: path.join(source, "**", "*.s{a,c}ss"),
		tasks: ["compass:dev"],
		options: {
			interrupt: true,
			livereload: true
		}
	});

	grunt.config.set("build.compass", ["compass:bundle", "compass:prod"]);

};
