/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update RBP", function (plugin) {
		var pkg = require("./utils/pkg");

		var branch;
		var bits = plugin.split("@");

		plugin = "red-boilerplate";

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		// Sanity check
		pkg.config.rbp = pkg.config.rbp || {};
		pkg.config.rbp.repository = pkg.config.rbp.repository || {};

		branch = branch || pkg.config.rbp.repository.branch || "master";
		grunt.task.run("install:%p@%b:update".replace("%p", plugin).replace("%b", branch));
	});

};
