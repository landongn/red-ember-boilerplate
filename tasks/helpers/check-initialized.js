/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("check_initialized", function (done) {
		var fs = require("fs");
		var pkg = require("../utils/pkg");
		var colors = require("colors");
		var initialized = pkg.initialized;

		if (initialized) {
			var localPkg = require("../utils/local-pkg"),
				requiredPaths = pkg.config.requiredPaths,
				i, j, req;

			for (i = 0, j = requiredPaths.length; i < j; i++) {
				if (!fs.existsSync("./" + requiredPaths[i])) {
					grunt.log.writeln("The required path ".yellow + requiredPaths[i].red.bold + " was not found. Run `grunt start` to correct this.".yellow);
					localPkg.initialized = false;
				}
			}

			if (localPkg.initialized === true) {
				done(true);
			} else {
				localPkg.save();
				done(false);
			}
		} else {
			done(false);
		}
	});

};
