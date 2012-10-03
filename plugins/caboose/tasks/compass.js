/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.config.set("compass", {
		dev: {
			src: "resources/compass/scss",
			dest: "project/static/css",
			outputstyle: "expanded",
			linecomments: true,
			forcecompile: true,
			images: "project/static/img",
			fonts: "project/static/fonts",
			relativeassets: true,
			bundleExec: true
		},
		prod: {
			src: "<config:compass.dev.src>",
			dest: "<config:compass.dev.dest>",
			outputstyle: "compressed",
			linecomments: false,
			forcecompile: "<config:compass.dev.forcecompile>",
			images: "<config:compass.dev.images>",
			fonts: "<config:compass.dev.fonts>",
			relativeassets: "<config:compass.dev.relativeassets>",
			bundleExec: "<config:compass.dev.bundleExec>"
		}
	});

	grunt.config.set("watch.compass", {
		files: "resources/compass/s{a,c}ss/**/*.scss",
		tasks: ["compass:dev"]
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

	grunt.loadNpmTasks("grunt-compass");

};
