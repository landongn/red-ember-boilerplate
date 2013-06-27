/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		caboose = require(path.join(__dirname, "..", "plugin.json")),
		source = caboose.config.scope;

	grunt.registerTask("caboose:bundle", "Ensure your gem bundle is up to date.", function () {
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

	grunt.config.set("watch.caboose", {
		files: path.join(source, "**", "*.s{a,c}ss"),
		tasks: ["caboose:dev"],
		options: {
			interrupt: true
		}
	});

	grunt.config.set("watch.livereload", {
		files: [
			path.join(source, "..", "static", "css", "**", "*.css"),
			path.join(source, "img", "**", "*.{png,jpg,jpeg,gif,webm,svg}")
		],
		options: {
			interrupt: true,
			livereload: true,
			debounceDelay: 250
		}
	});

	grunt.config.set("build.caboose", {
		"pre": ["caboose:bundle"],
		"build": ["caboose:prod"]
	});

};
