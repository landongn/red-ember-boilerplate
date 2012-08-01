/*global module:false*/
var pkg = require("../utils/pkg");

module.exports = function (grunt) {

	grunt.registerHelper("check_initialized", function (done) {
		var initialized = pkg.config.initialized;

		if (initialized) {
			done(true);
		} else {
			grunt.log.writeln("You need to run ".red + "grunt start" + " before running tasks.".red);
			done(false);
		}
	});

};
