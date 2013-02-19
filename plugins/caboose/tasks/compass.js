/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	// Config options
	grunt.config.set("compass", {
		dev: {
			http_path: "/",
			sass_dir: "resources/compass/scss/project",
			css_dir: "project/static/css",
			images_dir: "project/static/img",
			fonts_dir: "project/static/fonts",
			javascripts_dir: "project/static/js",
			additional_import_paths: ["resources/compass/scss/caboose"],
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

		},
		prod: {
			http_path: "<config:compass.dev.http_path>",
			sass_dir: "<config:compass.dev.sass_dir>",
			css_dir: "<config:compass.dev.css_dir>",
			images_dir: "<config:compass.dev.images_dir>",
			fonts_dir: "<config:compass.dev.fonts_dir>",
			javascripts_dir: "<config:compass.dev.javascripts_dir>",
			additional_import_paths: "<config:compass.dev.additional_import_paths>",
			output_style: ":compressed",
			line_comments: false,
			relative_assets: "<config:compass.dev.relative_assets>",
			bundle_exec: "<config:compass.dev.bundle_exec>",
			force_compile: "<config:compass.dev.force_compile>"
		}
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
			stdio: "inherit"
		});

		child.on("exit", function (code) {
			if (code !== 0) {
				grunt.log.writeln();
				grunt.log.writeln("Installing missing gems...");

				child = cp.spawn("bundle", ["install"], {
					stdio: "inherit"
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
