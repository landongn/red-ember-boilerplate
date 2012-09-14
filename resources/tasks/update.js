/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.config.rbp = pkg.config.rbp || {};
		pkg.config.rbp.repository = pkg.config.rbp.repository || {};

		// Set plugin if not deflined
		plugin = plugin || pkg.config.rbp.name;

		var branch;
		var bits = plugin.split("@");

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		branch = branch || pkg.config.rbp.repository.branch || "master";
		grunt.task.run("install:%p@%b:update".replace("%p", plugin).replace("%b", branch));
	});

};
