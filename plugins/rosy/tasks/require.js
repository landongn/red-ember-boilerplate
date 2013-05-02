/*
 * grunt-contrib-requirejs
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var absPath;

	var fs = require("fs");
	var colors = require("colors");
	var requirejs = require("requirejs");
	var lineBreak = "----------------";

	// TODO: extend this to send build log to grunt.log.ok / grunt.log.error
	// by overriding the r.js logger (or submit issue to r.js to expand logging support)
	requirejs.define("node/print", [], function () {
		return function print(msg) {
			if (grunt.option("quiet")) {
				return;
			}

			msg = msg.replace(new RegExp(absPath + "(/)?", "mg"), "");

			if (msg.substring(0, 5) === "Error") {
				msg = msg.replace(absPath);
				grunt.fail.warn(msg);
			} else {
				if (msg.indexOf(lineBreak) !== -1) {
					msg = msg.split(lineBreak);
					msg.shift();

					grunt.log.subhead("Built with the following modules:".grey);

					msg = msg.join("");
				}

				if (msg.indexOf("Tracing dependencies for:") !== -1) {
					grunt.log.subhead(msg.trim().grey);
				} else if (msg.indexOf("Uglifying file:") !== -1) {
					grunt.log.writeln(msg.trim().green);
				} else {
					grunt.log.writeln(msg.trim().grey);
				}
			}
		};
	});

	grunt.registerMultiTask("requirejs", "Build a RequireJS project.", function () {
		absPath = process.cwd();

		var done = this.async();
		var options = this.options({
			logLevel: 0
		});

		grunt.verbose.writeflags(options, "Options");

		requirejs.optimize(options, function (response) {
			done();
		});
	});
};
