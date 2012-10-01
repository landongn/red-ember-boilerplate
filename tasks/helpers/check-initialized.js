/*global module:false*/

module.exports = function (grunt) {

	grunt.registerHelper("check_initialized", function (done) {
		var fs = require("fs");
		var pkg = require("../utils/pkg");
		var initialized = pkg.initialized;

		if (initialized) {
			var localPkg = require("../utils/local-pkg"),
				local = localPkg.config,
				requiredPaths = local.requiredPaths,
				i, j, req;

			for (i = 0, j = requiredPaths.length; i < j; i++) {
				if (!fs.existsSync("./" + requiredPaths[i])) {
					local.initialized = false;
				}
			}

			if (local.initialized === true) {
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
