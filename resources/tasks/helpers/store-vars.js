/*global module:false*/
module.exports = function (grunt) {

	var pkg = require("../utils/pkg");

	grunt.registerHelper("store_vars", function (name, title, cb) {
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
