/*global module:false*/
module.exports = function (grunt) {
	// From https://github.com/gruntjs/grunt-contrib

	// TODO: ditch this when grunt v0.4 is released
	grunt.util = grunt.util || grunt.utils;

	var _ = grunt.util._;
	var kindOf = grunt.util.kindOf;
	var absPath;

	var fs = require("fs");
	var colors = require("colors");
	var requirejs = require("requirejs");
	var lineBreak = "----------------";

	// Helper for consistent options key access across contrib tasks.
	grunt.registerHelper("options", function (data, defaults) {
		var _ = grunt.util._;
		var namespace = data.nameArgs.split(":");
		var task = grunt.config(_.flatten([namespace, "options"]));
		var global_subtask = namespace.length > 1 ? grunt.config(_.flatten(["options", namespace])) : {};
		var global = grunt.config(["options", namespace[0]]);

		return _.defaults({}, task, global_subtask, global, defaults || {});
	});

	// TODO: extend this to send build log to grunt.log.ok / grunt.log.error
	// by overriding the r.js logger (or submit issue to r.js to expand logging support)
	requirejs.define("node/print", [], function () {
		return function print (msg) {
			if (msg.substring(0, 5) === "Error") {
				grunt.log.errorlns(msg);
				grunt.fail.warn("RequireJS failed.");
			} else {
				msg = msg.replace(new RegExp(absPath, "mg"), "");

				if (msg.indexOf(lineBreak) !== -1) {
					msg = msg.split(lineBreak);
					msg.shift();

					grunt.log.subhead("    Built with the following modules:".grey);

					msg = msg.join("").replace(/\n/g, "\n    ");
				}

				if (msg.indexOf("Tracing dependencies for:") !== -1) {
					grunt.log.subhead("    " + msg.trim().grey);
				} else if (msg.indexOf("Uglifying file:") !== -1) {
					grunt.log.writeln("    " + msg.trim().green);
				} else {
					grunt.log.writeln("    " + msg.trim().grey);
				}
			}
		};
	});

	grunt.registerMultiTask("requirejs", "Build a RequireJS project.", function () {
		var options = grunt.helper("options", this, {
			logLevel : 0
		});

		absPath = fs.realpathSync() + "/";

		_.each(options, function (value, key) {
			if (kindOf(value) === "string") {
				options[key] = grunt.template.process(value);
			}
		});

		grunt.verbose.writeflags(options, "Options");

		requirejs.optimize(options);
	});
};
