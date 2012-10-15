/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("store_vars", function (name, title, cb) {
		var pkg = require("../utils/pkg");

		pkg.config.vars["PROJECT_NAME"] = name;
		pkg.config.vars["PROJECT_TITLE"] = title;

		// Replace variables
		grunt.helper("replace_in_files", function () {
			pkg.save();

			if (cb) {
				cb();
			}
		});
	});

};
