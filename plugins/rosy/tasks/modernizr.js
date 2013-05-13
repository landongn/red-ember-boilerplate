/* jshint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		path = require("path"),
		rosy = require(path.join(__dirname, "..", "..", "rosy", "plugin.json")),
		output = path.join("project", "static", "js"),
		source = rosy.config.scope;

	// Project configuration.
	grunt.config.set("modernizr", {

		// [REQUIRED] Path to the build you're using for development.
		"devFile" : path.join(source, "libs", "modernizr", "modernizr.js"),

		// [REQUIRED] Path to save out the built file.
		"outputFile" : path.join(output, "libs", "modernizr", "modernizr.min.js"),

		// Based on default settings on http://modernizr.com/download/
		"extra" : {
			"shiv" : true,
			"printshiv" : false,
			"load" : true,
			"mq" : false,
			"cssclasses" : true
		},

		// Based on default settings on http://modernizr.com/download/
		"extensibility" : {
			"addtest" : false,
			"prefixed" : false,
			"teststyles" : false,
			"testprops" : false,
			"testallprops" : false,
			"hasevents" : false,
			"prefixes" : false,
			"domprefixes" : false
		},

		// By default, source is uglified before saving
		"uglify" : true,

		// Define any tests you want to impliticly include.
		"tests" : [],

		// By default, this task will crawl your project for references to Modernizr tests.
		// Set to false to disable.
		"parseFiles" : true,

		// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files.
		// You can override this by defining a "files" array below.
		"files" : [
			path.join(source, "**", "*.js"),
			path.join(source, "..", "{sass,scss}", "**", "*.scss")
		].concat([
			path.join("env"),
			path.join("robyn"),
			path.join(".bundle"),
			path.join("node_modules"),
			path.join("project", "static"),
			path.join("collected-static"),
			path.join(".{git,sass-cache,robyn}"),
			path.join("project", "**", "js", "libs")
		].map(function (src) {
			return "!" + path.join(src, "**", "*");
		})),

		// When parseFiles = true, matchCommunityTests = true will attempt to
		// match user-contributed tests.
		"matchCommunityTests" : false,

		// Have custom Modernizr tests? Add paths to their location here.
		"customTests" : []
	});

	grunt.config.set("build.modernizr", "modernizr");

	grunt.loadNpmTasks("grunt-modernizr");

};
