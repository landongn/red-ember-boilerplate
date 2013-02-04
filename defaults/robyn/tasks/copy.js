/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.config.set("copy", {
		files: [{
			src: "project/source/local",
			dest: "project/static/local"
		}, {
			src: "project/source/fonts",
			dest: "project/static/fonts"
		}]
	});
};
