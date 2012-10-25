/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {

	// Just an example function that does nothing.
	// Customize to your needs.
	var doSomething = function () {
		grunt.helper("spawn", {
			cmd: "node",
			args: ["--version"],
			title: "Getting Node version",
			complete: function (code) {
				if (code !== 0) {
					return exit("No version found.");
				}

				return exit();
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

	doSomething();

};
