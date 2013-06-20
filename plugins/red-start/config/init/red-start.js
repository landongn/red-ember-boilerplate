/*jslint node: true */

module.exports = function (grunt, helper, cb) {
	"use strict";

	var fs = require("fs");
	var path = require("path");

	var updateRunScript = function () {
		var run = path.join("scripts", "run.sh");

		if (fs.existsSync(run)) {
			var contents = grunt.file.read(run);
			contents = contents.replace("SERVER=$1", "SERVER=$@");

			grunt.file.write(run, contents);
		}

		return exit();
	};

	var runSync = function () {
		helper.spawn({
			cmd: "sh",
			args: [path.join("scripts", "sync.sh")],
			title: "Syncing database",
			complete: function (code) {
				if (code !== 0) {
					return exit("Something went wrong attempting to run scripts/sync.sh");
				}

				updateRunScript();
			}
		});
	};

	var runSetup = function () {
		helper.spawn({
			cmd: "sh",
			args: [path.join("scripts", "setup.sh")],
			title: "Creating a Python virtualenv. This may take a minute",
			complete: function (code) {
				if (code !== 0) {
					return exit("Something went wrong attempting to run scripts/setup.sh");
				}

				runSync();
			}
		});
	};

	var runRedStart = function () {
		helper.spawn({
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
			path.join("project", "manage.py"),
			path.join("scripts", "setup.sh")
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
			helper.writeln("Looks like RED Start was already run on this project. Skipping ahead...".grey);
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
