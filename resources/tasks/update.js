/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update RBP", function (branch) {
		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.config.rbp = pkg.config.rbp || {};
		pkg.config.rbp.repository = pkg.config.rbp.repository || {};

		branch = branch || pkg.config.rbp.repository.branch || "master";
		grunt.task.run("install:red-boilerplate@%s".replace("%s", branch));
	});

};
