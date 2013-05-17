/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		caboose = require(path.join(__dirname, "..", "plugin.json")),
		source = caboose.config.scope;

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
