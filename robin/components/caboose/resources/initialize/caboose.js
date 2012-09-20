/*jslint node: true, onevar: false */
/*global jake, desc, task, error, pkg, installModule, parseFiles */
"use strict";

module.exports = {
	exec : function (exec, args, cwd, suppress, doneCB) {
		var cp = require("child_process"),
			child, data;

		child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			setsid: true,
			stdio: (suppress) ? null : "inherit"
		});

		if (child.stdout) {
			data = "";

			child.stdout.on("data", function (buffer) {
				data += buffer.toString();
			});
		}

		child.on("exit", function (code) {
			doneCB(!code, data);
		});
	},

	installGems : function () {
		this.exec("bundle", ["install", "--path", "resources/compass/gems"], null, false, function (success, data) {
			if (!success) {
				return this.exit("No executable named bundle found.");
			}

			return this.exit();
		}.bind(this));
	},

	moveGemfileToRoot : function () {
		var fs = require("fs"),
			path = require("path"),
			gempath = path.join(__dirname, "../tasks/config/Gemfile");

		if (fs.existsSync(gempath)) {
			this.exec("mv", [gempath, gempath + ".lock", "."], null, false, function (success) {
				if (success) {
					this.installGems();
				} else {
					return this.exit("Failed to move %s".replace("%s", gempath));
				}
			}.bind(this));
		} else {
			this.installGems();
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
		this.moveGemfileToRoot();
	}
};
