module.exports = function(grunt) {

	grunt.registerTask("server", "An alias for Python's runserver", function () {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");

		var args = grunt.utils.toArray(arguments);
		var done = this.async();

		var port = (args[1] || args[0]);
		var ip = (args[1] ? args[0] : null);
		var cmd = (ip || "0.0.0.0") + ":" + (port || "8000");

		var activate = path.join("env", "bin", "activate");
		var setup = path.join("scripts", "setup.sh");
		var server = path.join("scripts", "run.sh");

		var child;

		var runProject = function () {
			if (fs.existsSync(setup)) {
				child = cp.spawn("sh", [server, cmd], {
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
					done(!!code);
				});
			} else {
				console.error("No run script found. Aborting.");
				process.exit();
			}
		};

		var setupProject = function () {
			if (fs.existsSync(setup)) {
				child = cp.spawn("sh", [setup], {
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
					if (code !== 0) {
						process.exit();
					} else {
						runProject();
					}
				});
			} else {
				console.error("No setup script found. Aborting.");
				process.exit();
			}
		};

		if (!fs.existsSync(activate)) {
			setupProject();
		} else {
			runProject();
		}
	});

};
