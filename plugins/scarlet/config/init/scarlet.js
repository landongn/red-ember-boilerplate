/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {
    var config = require('../../plugin.json').config
	var runSetup = function () {
		grunt.helper("spawn", {
			cmd: "git",
			args: ["submodule", "add", config.repo, "scarlet"],
			title: "Adding scarlet as a submodule",
			complete: function (code) {
				if (code !== 0) {
					return exit("Something went wrong while adding the submodule");
				}
                grunt.helper("spawn", {
			                cmd: "git",
			                args: ["submodule", "update"],
			                title: "Update submodule",
		                });
				return exit();
			}
		});
	};

	var checkInstall = function () {

		grunt.helper("spawn", {
			cmd: "grep",
			args: ["scarlet", ".gitmodules"],
			title: "Checking for scarlet submodule",
			complete: function (code) {
				if (code !== 1) {
					return exit("The scarlet submodule is already present");
				} else {
                    runSetup();
                }
			}
		});
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
