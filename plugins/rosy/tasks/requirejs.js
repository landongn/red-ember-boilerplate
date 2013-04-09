/*jslint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		path = require("path"),
		rosy = require(path.join(__dirname, "../plugin.json")),
		output = "project/static/js",
		source = rosy.config.scope;

	// Project configuration.
	grunt.config.set("requirejs.desktop", {
		options : {
			mainConfigFile : path.join(source, "config.js"),
			urlArgs : null,
			include : ["config.js"],
			paths : {
				"jquery": "empty:"
			},
			optimize : "uglify",
			out : path.join(output, "site.min.js"),
			name : grunt.task.directive("<config:meta.projectName>") + "/Site",
			skipModuleInsertion : true
		}
	});

	grunt.config.set("watch.requirejs", {
		files: path.join(source, "**/*[^.min].js"),
		tasks: ["requirejs"]
	});

	grunt.config.set("build.requirejs", "requirejs");
};
