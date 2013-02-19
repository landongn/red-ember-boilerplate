/*global module:false*/
module.exports = function (grunt) {
	var path = require('path');
	var paths = require('./utils/paths');

	// Project configuration.
	grunt.config.set("requirejs.admin", {
		options : {
			mainConfigFile : path.join(paths.source_path, "js", "config.js"),
			urlArgs : null,
			include : ["config.js"],
			paths : {
				"jquery": "empty:",
				"rosy": path.join(paths.base_js_source, "rosy")
			},
			optimize : "uglify",
			out : path.join(paths.static_path, "js", "admin.min.js"),
			name : "admin/Site",
			skipModuleInsertion : true
		}
	});
};
