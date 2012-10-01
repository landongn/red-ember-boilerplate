/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("store_vars", function (name, title, cb) {
		var pkg = require("../utils/pkg");

		pkg.vars["PROJECT_NAME"] = name;
		pkg.vars["PROJECT_TITLE"] = title;

		// Replace variables
		grunt.helper("replace_in_files", function () {
			pkg.save();

			if (cb) {
				cb();
			}
		});
	});

};
