/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var writeln = function (string) {
		var spacer = "    ";

		if (!grunt.option("verbose")) {
			grunt.log.writeln("    " + string);
		}
	};

	return writeln;

};
