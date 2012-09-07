module.exports = function(grunt) {

	grunt.registerTask("info", "List project info", function () {

		var done = this.async();
		var path = require('path');
		var hasInitialized;

		grunt.helper("check_initialized", function (initialized) {
			hasInitialized = initialized;

			if (!initialized) {
				grunt.task.run("start");
			}
		});

		var pkg = require("../../package.json");
		var rbp = pkg.config.rbp;

		var keys = ["name", "version", "author", "description"];
		var i, j;

		console.log();

		for (i = 0, j = keys.length; i < j; i++) {
			if (pkg[keys[i]]) {
				console.log("Project %k: %v".replace("%k", keys[i]).replace("%v", pkg[keys[i]]));
			}
		}

		if (pkg.repository) {
			console.log("Project Repository: %s".replace("%s", pkg.repository.url));
		}

		console.log();
		console.log("RED Boilerplate %s".replace("%s", rbp.version));
		console.log("    via %u @ branch %b".replace("%u", rbp.repository.url).replace("%b", rbp.repository.branch));
		console.log();

		var plugTitle;

		for (var key in pkg.config.installed_plugins) {
			if (!plugTitle) {
				console.log("RBP Plugins:");
				plugTitle = true;
			}

			var plug = pkg.config.installed_plugins[key];

			if (typeof plug !== "string") {
				console.log("- %n %v (%d)".replace("%n", plug.name).replace("%v", plug.version).replace("%d", plug.description));
			} else {
				console.log("- %k (%d)".replace("%k", key).replace("%d", plug));
			}
		}

		done();
	});

};
