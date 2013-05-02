/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		caboose = require(path.join(__dirname, "../plugin.json")),
		output = "project/static",
		source = caboose.config.scope;

	// Config options
	grunt.config.set("compass.dev", {
		http_path: "/",
		sass_dir: path.join(source, "scss/project"),
		css_dir: path.join(output, "css"),
		images_dir: path.join(output, "img"),
		fonts_dir: path.join(output, "fonts"),
		javascripts_dir: path.join(output, "js"),
		generated_images_dir: path.join(output, "img"),
		additional_import_paths: [path.join(source, "scss/caboose")],
		sprite_load_path: [path.join(source, "img")],
		output_style: ":expanded",
		line_comments: true,
		relative_assets: true,
		bundle_exec: true,
		force_compile: true,

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
		http_path: "<config:compass.dev.http_path>",
		sass_dir: "<config:compass.dev.sass_dir>",
		css_dir: "<config:compass.dev.css_dir>",
		images_dir: "<config:compass.dev.images_dir>",
		fonts_dir: "<config:compass.dev.fonts_dir>",
		javascripts_dir: "<config:compass.dev.javascripts_dir>",
		generated_images_dir: "<config:compass.dev.generated_images_dir>",
		additional_import_paths: "<config:compass.dev.additional_import_paths>",
		sprite_load_path: "<config:compass.dev.sprite_load_path>",
		output_style: ":compressed",
		line_comments: false,
		relative_assets: "<config:compass.dev.relative_assets>",
		bundle_exec: "<config:compass.dev.bundle_exec>",
		force_compile: "<config:compass.dev.force_compile>"
	});

	// Trick grunt by creating a task named "watch:compass"
	// Instead of running the grunt watcher, it invokes the compass watcher
	grunt.registerTask("watch:compass", function () {
		grunt.task.run(["compass:dev:watch"]);
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

	grunt.config.set("build.compass", ["compass:bundle", "compass:prod"]);
};
