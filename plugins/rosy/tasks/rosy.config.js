/* jshint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		cwd = process.cwd(),
		path = require("path"),
		rosy = require(path.join(__dirname, "..", "plugin.json")),
		output = path.join("project", "static", "js"),
		source = rosy.config.scope,
		rosyConfig = path.join("libs", "rosy", "config.js");

	// Project configuration.
	grunt.config.set("requirejs.desktop", {
		options : {
			mainConfigFile : path.join(source, rosyConfig),
			urlArgs : null,
			include : [rosyConfig],
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

};
