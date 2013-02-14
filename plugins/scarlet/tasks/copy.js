/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
    var config = require('../plugin.json').config
    var path = require('path');

	// By default, dev / prod are the same
	// Feel free to customize to your needs
	grunt.config.set("copy.admin", [
        {
	        src: config.admin_path + "source/fonts",
	        dest: config.admin_path + "static/scarlet/fonts"
        }, {
	        src: config.admin_path + "source/js",
	        dest: config.admin_path + "static/scarlet/js"
    	}, {
	        src: config.admin_path + "source/img",
	        dest: config.admin_path + "static/scarlet/img"
    	}
    ]);

	grunt.config.set("watch.copy_admin", {
		files : grunt.config.get("copy").admin.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy:admin:soft"]
	});

	grunt.config.set("build.copy_admin", ["copy:admin"]);
};
