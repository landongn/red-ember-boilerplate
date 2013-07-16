/* jshint node:true, sub:true */
module.exports = function (grunt) {
	"use strict";

	var storeVars = function (name, title, cb) {
		var helper = require("../helpers").init(grunt);
		var pkg = require("../utils/pkg");

		pkg.config.vars["PROJECT_NAME"] = name;
		pkg.config.vars["PROJECT_TITLE"] = title;

		// Replace variables
		helper.replaceInFiles(function () {
			// As of npm 1.3.2, it will complain about uppercase characters in pkg.name
			// This hack lowercases the project name, but only in package.json
			var path = require("path");
			var pristinePath = path.join(process.cwd(), "package.json");
			var pristinePkg = grunt.file.readJSON(pristinePath);

			pristinePkg.name = pristinePkg.name.toLowerCase();
			grunt.file.write(pristinePath, JSON.stringify(pristinePkg, null, 2));

			if (cb) {
				cb();
			}
		});
	};

	return storeVars;

};
