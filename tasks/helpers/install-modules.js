/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("install_modules", function (args, cb) {
		grunt.helper("spawn", {
			cmd: "npm",
			args: ["install"].concat(args),
			title: "Installing npm packages",
			complete: cb
		});
	});

};
