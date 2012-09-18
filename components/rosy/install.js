/*jslint node: true */
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

	installExternalScripts : function () {
		var fs = require("fs"),
			path = require("path"),
			installpath = path.join(__dirname, "project/static/js/libs/_install");

		this.exec("node", [path.join(installpath, "installer")], null, false, function (success) {
			if (!success) {
				return this.exit("An error occurred while installing external libraries.");
			}

			if (fs.existsSync(installpath)) {
				var installer = path.join(installpath, "installer.js");
				var config = path.join(installpath, "libs.config.js");

				if (fs.existsSync(installer)) {
					fs.unlinkSync(installer);
				}

				if (fs.existsSync(config)) {
					fs.unlinkSync(config);
				}

				fs.rmdirSync(installpath);
			} else {
				return this.exit("Can't find %s. Exiting.".replace("%s", installpath));
			}

			return this.exit();
		}.bind(this));
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
		this.installExternalScripts();
	}
};
