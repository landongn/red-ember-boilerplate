/*global module:false*/
module.exports = function (grunt) {

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
