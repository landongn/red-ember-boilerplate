/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {

	var runSetup = function () {
		grunt.helper("spawn", {
			cmd: "sh",
			args: ["./scripts/setup.sh"],
			title: "Creating a virtualenv. This may take a minute",
			complete: function (code) {
				if (code !== 0) {
					return exit("Something went wrong attempting to run scripts/setup.sh");
				}

				return exit();
			}
		});
	};

	var runRedStart = function () {
		grunt.helper("spawn", {
			cmd: "red-start",
			args: ["--no-prompt", "--no-git"],
			title: "Creating a new red-start project",
			complete: function (code) {
				if (code !== 0) {
					return exit("An error occured attempting to run red-start.");
				}

				runSetup();
			}
		});
	};

	var checkInstall = function () {
		var fs = require("fs");

		var filesToCheck = [
			"fabfile.py",
			"project/manage.py",
			"scripts/setup.sh"
		];

		var isInstalled = true;

		for (var i = 0, j = filesToCheck.length; i < j; i++) {
			if (!fs.existsSync(filesToCheck[i])) {
				isInstalled = false;
				break;
			}
		}

		if (!isInstalled) {
			runRedStart();
		} else {
			grunt.helper("writeln", "Looks like RED Start was already run on this project. Skipping ahead...".grey);
			runSetup();
		}
	};

	var exit = function (error) {
		if (cb) {
			cb(error);
		} else {
			process.exit();
		}
	};

	checkInstall();

};
