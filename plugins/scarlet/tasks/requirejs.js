/*global module:false*/
module.exports = function (grunt) {
    var config = require('../plugin.json').config

	// Project configuration.
	grunt.config.set("requirejs.admin", {
		options : {
			mainConfigFile : config.admin_path + "source/js/config.js",
			urlArgs : null,
			include : ["config.js"],
			paths : {
				"jquery": "empty:"
			},
			optimize : "uglify",
			out : config.admin_path + "static/scarlet/js/admin.min.js",
			name : "admin/Site",
			skipModuleInsertion : true
		}
	});

};
