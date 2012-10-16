/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {
	var fs = require("fs"),
			path = require("path");

	var installExternalScripts = function () {
		var installpath = path.join(process.cwd(), "project/static/js/libs/_install");

		if (!fs.existsSync(path.join(installpath, "installer.js"))) {
			return cleanupFiles(installpath);
		}

		grunt.helper("spawn", {
			cmd: "node",
			args: [path.join(installpath, "installer.js")],
			title: "Installing external libraries",
			complete: function (code) {
				if (code !== 0) {
					return exit("An error occurred while installing external libraries.");
				}

				return cleanupFiles(installpath);
			}
		});
	};

	var cleanupFiles = function (installpath) {
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
		}

		return exit();
	};

	var exit = function (error) {
		if (cb) {
			cb(error);
		} else {
			process.exit();
		}
	};

	installExternalScripts();
};
