/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	// Config options
	grunt.config.set("compass", {
		dev: {
			http_path: "/",
			sass_dir: "resources/compass/scss",
			css_dir: "project/static/css",
			images_dir: "project/static/img",
			fonts_dir: "project/static/fonts",
			javascripts_dir: "project/static/js",
			output_style: ":expanded",
			line_comments: true,
			relative_assets: true,
			bundle_exec: true,
			force_compile: true
		},
		prod: {
			http_path: "/",
			sass_dir: "resources/compass/scss",
			css_dir: "project/static/css",
			images_dir: "project/static/img",
			fonts_dir: "project/static/fonts",
			javascripts_dir: "project/static/js",
			output_style: ":compressed",
			line_comments: false,
			relative_assets: true,
			bundle_exec: true,
			force_compile: true
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
