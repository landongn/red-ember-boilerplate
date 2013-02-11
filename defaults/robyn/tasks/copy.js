/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var path = require("path");

	grunt.config.set("copy", {
		dev: [{
			src: "project/source/local",
			dest: "project/static/local"
		}, {
			src: "project/source/fonts",
			dest: "project/static/fonts"
		}, {
			src: "project/source/js",
			dest: "project/static/js"
		}],

		prod: [{
			src: "project/source/local",
			dest: "project/static/local"
		}, {
			src: "project/source/fonts",
			dest: "project/static/fonts"
		}, {
			src: "project/source/js",
			dest: "project/static/js"
		}]
	});

	grunt.config.set("build.copy", ["copy:prod"]);

	grunt.config.set("watch.copy", {
		files : grunt.config.get("copy").dev.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy:dev"]
	});
};
