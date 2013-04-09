/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {
	var config = require("../../plugin.json").config;
	var cwd = process.cwd();
	var path = require("path");
	var fs = require("fs");

	var scarletDir = "scarlet";

	var runSetup = function () {
		grunt.helper("spawn", {
			cmd: "git",
			args: ["submodule", "add", config.repo, scarletDir],
			title: "Adding scarlet as a submodule",
			complete: function (code) {
				if (code !== 0) {
					return exit("Something went wrong while adding the submodule");
				}

				grunt.helper("spawn", {
					cmd: "git",
					args: ["submodule", "update", "--init", scarletDir],
					title: "Update submodule",
					complete: function (code) {
						return exit();
					}
				});
			}
		});
	};

	var checkInstall = function () {
		if (fs.existsSync(path.join(cwd, scarletDir))) {
			grunt.helper("spawn", {
				cmd: "git",
				args: ["submodule", "update", "--init", scarletDir],
				title: "Update submodule",
				complete: function (code) {
					return exit();
				}
			});
		} else {
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
