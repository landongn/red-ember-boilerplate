/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";
    var fs = require('fs');
    var base_source = 'project/source/'
    if (fs.existsSync(base_source)) {
    } else {
        base_source = 'resources/'
    }
    var config = require('../plugin.json').config

	// Config options
	grunt.config.set("compass.admin", {
		http_path: "/",
		sass_dir: config.admin_path + "source/compass/scss/admin",
		css_dir: config.admin_path + "static/scarlet/css",
		images_dir: config.admin_path + "static/scarlet/img",
		fonts_dir: config.admin_path + "static/scarlet/fonts",
		javascripts_dir: config.admin_path + "scarlet/static/js",
		additional_import_paths: [base_source + "compass/scss/caboose"],
		output_style: ":expanded",
		line_comments: true,
		relative_assets: true,
		bundle_exec: true,
		force_compile: true
    });

    grunt.config.set("build.compass_admin", ['compass:admin']);
};
