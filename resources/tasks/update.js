/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var done = this.async();
		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.config.org = pkg.config.org || {};
		pkg.config.org.repository = pkg.config.org.repository || {};

		// Set plugin if not deflined
		plugin = plugin || pkg.config.org.name;

		var branch;
		var bits = plugin.split("@");

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		branch = branch || pkg.config.org.repository.branch || "master";
		grunt.task.run("install:%p@%b:update".replace("%p", plugin).replace("%b", branch));

		grunt.helper("on_update", function () {
			done();
		});
	});

};
