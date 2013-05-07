/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var write = function (string) {
		var spacer = "    ";

		if (!grunt.option("verbose")) {
			grunt.log.write("    " + string);
		}
	};

	return write;

};
