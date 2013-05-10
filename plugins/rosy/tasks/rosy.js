/* jshint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		path = require("path"),
		rosy = require(path.join(__dirname, "..", "plugin.json")),
		output = path.join("project", "static", "js"),
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
			generateSourceMaps : true,
			preserveLicenseComments : false,
			optimize : "uglify2",
			uglify2 : {
				warnings : true
			},
			out : path.join(output, "site.min.js"),
			name : grunt.template.process("<%= meta.projectName %>") + "/Site",
			skipModuleInsertion : true
		}
	});

	grunt.config.set("watch.requirejs", {
		files: path.join(source, "**", "*[^.min].js"),
		tasks: ["requirejs:reload"],
		options: {
			interrupt: true,
			livereload: true
		}
	});

	grunt.config.set("build.requirejs", ["requirejs", "requirejs:uglify"]);
};
