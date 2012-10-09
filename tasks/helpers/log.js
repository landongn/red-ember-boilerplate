/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var spacer = "    ";

	grunt.registerHelper("write", function (string) {
		if (!grunt.option("verbose")) {
			grunt.log.write("    " + string);
		}
	});

	grunt.registerHelper("writeln", function (string) {
		if (!grunt.option("verbose")) {
			grunt.log.writeln("    " + string);
		}
	});

};
