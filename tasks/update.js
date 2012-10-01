/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var done = this.async();

		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.repository = pkg.repository || {};

		// Set plugin if not deflined
		plugin = plugin || pkg.name;

		var branch;
		var bits = plugin.split("@");

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		branch = branch || pkg.repository.branch || "master";

		if (plugin === pkg.name) {
			var cp = require("child_process"),
				args = "git submodule foreach git pull origin".split(" ");

			args.push(branch);
			var child = cp.spawn(args.shift(), args, {
				stdio: "inherit"
			});

			child.on("exit", function (code) {
				if (code !== 0) {
					done(false);
				} else {
					done();
				}
			});
		} else {
			grunt.task.run("install:%p@%b:update".replace("%p", plugin).replace("%b", branch));
			done();
		}
	});

};
