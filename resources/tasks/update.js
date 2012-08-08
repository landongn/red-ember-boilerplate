/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update RBP", function (branch) {
		var pkg = require("pkg");

		// Sanity check
		pkg.rbp = pkg.rbp || {};
		pkg.rbp.repository = pkg.rbp.repository || {};

		branch = branch || pkg.rbp.repository.branch || "master";
		grunt.task.run("install:%".replace("%s", branch));
	});

};
