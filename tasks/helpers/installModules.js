/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var installModules = function (args, cb) {
		var helper = require("../helpers").init(grunt);

		helper.spawn({
			cmd: "npm",
			args: ["install"].concat(args),
			title: "Installing npm packages",
			complete: cb
		});
	};

	return installModules;

};
