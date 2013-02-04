/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		caboose = require(path.join(__dirname, "../plugin.json")),
		source = path.join(caboose.config.scope, "img"),
		output = path.join(cwd, "project/static/img");

	grunt.config.set("img", {
		dev : {
			src: source,
			dest: output
		},

		prod: {
			src: source,
			dest: output
		}
	});

	grunt.config.set("watch.img", {
		files : [path.join(source, "**/*.{gif,png,jpeg,jpg}")],
		tasks : ["img:dev"]
	});

	grunt.config.set("build.img", ["img:prod"]);
};
