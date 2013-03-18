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

	// TODO: ditch this when grunt v0.4 is released
	grunt.util = grunt.util || grunt.utils;

	var absPath;

	var fs = require("fs");
	var colors = require("colors");
	var requirejs = require("requirejs");
	var lineBreak = "----------------";

	// Helper for consistent options key access across contrib tasks.
	grunt.registerHelper("options", function (data, defaults) {
		var global_target = data.target ? grunt.config(["options", data.name, data.target]) : null;
		var global_task = grunt.config(["options", data.name]);

		var target = data.target ? grunt.config([data.name, data.target, "options"]) : null;
		var task = grunt.config([data.name, "options"]);

		var options = grunt.util._.defaults({}, target, task, global_target, global_task, defaults);

		return grunt.util.recurse(options, function (value) {
			if (typeof value !== "string") { return value; }

			return grunt.template.process(value);
		});
	});

	grunt.registerMultiTask("requirejs", "Build a RequireJS project.", function () {

		// TODO: extend this to send build log to grunt.log.ok / grunt.log.error
		// by overriding the r.js logger (or submit issue to r.js to expand logging support)
		requirejs.define("node/print", [], function () {
			return function print(msg) {
				if (grunt.option("quiet")) {
					return;
				}

				if (msg.substring(0, 5) === "Error") {
					grunt.log.errorlns(msg);
					grunt.fail.warn("RequireJS failed.");
				} else {
					msg = msg.replace(new RegExp(absPath, "mg"), "");

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

		var _ = grunt.util._;
		var kindOf = grunt.util.kindOf;
		var options = grunt.helper("options", this, {
			logLevel: 0
		});

		absPath = process.cwd();
		var done = this.async();

		_.each(options, function (value, key) {
			if (kindOf(value) === "string") {
				options[key] = grunt.template.process(value);
			}
		});

		grunt.verbose.writeflags(options, "Options");

		requirejs.optimize(options, function (response) {
			done();
		});
	});
};
