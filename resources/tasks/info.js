module.exports = function(grunt) {

	grunt.registerTask("info", "List project info", function () {

		var done = this.async();
		var path = require("path");
		var colors = require("colors");
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
				console.log((i === 0 ? "[*] " : "    ").cyan + "Project %k:".replace("%k", keys[i]).grey + " %v".replace("%v", pkg[keys[i]]));
			}
		}

		if (pkg.repository) {
			console.log("    " + "Project Repository:".grey + " %s".replace("%s", pkg.repository.url));
		}

		console.log();
		console.log("[*] ".cyan + "RED Boilerplate %s".replace("%s", rbp.version).magenta);
		console.log("    via %u @ branch %b".grey.replace("%u", rbp.repository.url).replace("%b", rbp.repository.branch));
		console.log();

		var plugTitle;

		for (var key in pkg.config.installed_plugins) {
			if (!plugTitle) {
				console.log("[*] ".cyan + "Installed RED Boilerplate plugins:".magenta);
				plugTitle = true;
			}

			var plug = pkg.config.installed_plugins[key];

			if (typeof plug !== "string") {
				console.log("[+] ".grey + "%n %v".replace("%n", plug.name).replace("%v", plug.version).cyan + " (%d)".replace("%d", plug.description).grey);
			} else {
				console.log("[+] ".grey + key.cyan + " (%d)".replace("%d", plug).grey);
			}
		}

		if (pkg.config.warnings) {
			console.log();
			console.log("[!] The following warnings were ignored:".yellow);

			var warnings = pkg.config.warnings;
			var warn, k;

			for (j = 0, k = warnings.length; j < k; j++) {
				warn = warnings[j];
				console.warn("[!] ".yellow + warn.plugin.cyan + " requires " + (warn.bin + " " + warn.version).magenta +
				". " + (warn.error || "You are on version " + warn.installedVersion.red.bold + "."));
			}
		}

		done();
	});

};
