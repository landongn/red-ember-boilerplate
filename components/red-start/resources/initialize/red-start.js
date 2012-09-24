/*jslint node: true */
/*global jake, desc, task, error, pkg, installModule, parseFiles */
"use strict";

module.exports = {
	exec : function (exec, args, cwd, suppress, doneCB) {
		var cp = require("child_process");
		process.stdin.resume();

		var child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			setsid: true
		});

		process.stdin.resume();
		process.stdin.pipe(child.stdin, {end: false});

		if (!suppress) {
			child.stdout.pipe(process.stdout);
		}

		child.addListener("exit", function (code) {
			doneCB(!code);
		});
	},

	runSetup : function () {
		this.exec("sh", ["./scripts/setup.sh"], null, false, function (success) {
			if (!success) {
				return this.exit("Something went wrong attempting to run scripts/setup.sh");
			}

			return this.exit();
		}.bind(this));
	},

	runRedStart : function () {
		this.exec("red-start", ["--no-prompt", "--no-git"], null, false, function (success) {
			if (!success) {
				return this.exit("An error occured attempting to run red-start.");
			}

			this.runSetup();
		}.bind(this));
	},

	checkInstall : function () {
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
			this.runRedStart();
		} else {
			console.log("Looks like RED Start is already installed. Skipping ahead...");
			this.runSetup();
		}
	},

	exit : function (error) {
		if (this.cb) {
			this.cb(error);
		} else {
			process.exit();
		}
	},

	run : function (cb) {
		this.cb = cb;
		this.checkInstall();
	}
};
