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
			pkg.save();

			if (cb) {
				cb();
			}
		});
	};

	return storeVars;

};
