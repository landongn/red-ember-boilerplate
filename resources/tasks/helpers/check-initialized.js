/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("check_initialized", function (done) {
		var pkg = require("../utils/pkg");
		var initialized = pkg.config.initialized;

		if (initialized) {
			done(true);
		} else {
			grunt.log.writeln("You need to run ".red + "grunt start" + " before running tasks.".red);
			done(false);
		}
	});

};
