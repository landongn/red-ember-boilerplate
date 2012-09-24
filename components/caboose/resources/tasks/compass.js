/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.config.set("compass", {
		dev: {
			config: "resources/compass/config.rb",
			src: "resources/compass/sass",
			dest: "project/static/css",
			linecomments: true,
			forcecompile: false,
			images: "project/static/img",
			outputstyle: "expanded",
			relativeassets: true,
			bundleExec: true
		},
		prod: {
			config: "<config:compass.dev.config>",
			src: "<config:compass.dev.src>",
			dest: "<config:compass.dev.dest>",
			outputstyle: "compressed",
			linecomments: false,
			forcecompile: true,
			images: "<config:compass.dev.images>",
			relativeassets: "<config:compass.dev.relativeassets>",
			bundleExec: "<config:compass.dev.bundleExec>"
		}
	});

	grunt.config.set("watch.compass", {
		files: "resources/compass/s{a,c}ss/**/*.scss",
		tasks: ["compass:dev"]
	});

	grunt.config.set("build.compass", "compass:prod");

	grunt.loadNpmTasks("grunt-compass");

};
