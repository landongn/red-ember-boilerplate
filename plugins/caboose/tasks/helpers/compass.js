/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	// Create a new multi task.
	grunt.registerMultiTask("compass", "Watch or compile your Compass files.", function (watch) {
		// require sass_dir
		if (typeof this.data.sass_dir === "undefined") {
			grunt.fail.warn("sass_dir must be defined");
		}

		// Return stringified paths, arrays, objects
		function stringify(value) {
			var regExp = /^(\:|\{|true|false)/;

			if (Array.isArray(value)) {
				value = "[" + value.map(function (val) {
					return "'" + val.trim() + "'";
				}).join(", ") + "]";
			} else if (typeof value === "string" && !(regExp).test(value.trim())) {
				value = "'" + value.trim() + "'";
			}

			return value;
		}

		// Tell grunt this task is asynchronous.
		var done = this.async();
		var cp = require("child_process");
		var cwd = process.cwd();
		var path = require("path");
		var fs = require("fs");
		var data = this.data;
		var force = data.force_compile;
		var bundle = data.bundle_exec;
		var tmp = [process.pid, "compass", new Date().getTime()].join("-");
		var cmd = bundle ? "bundle" : "compass";
		var args = [watch ? "watch" : "compile"];

		// Delete custom properties
		delete data.bundle_exec;
		delete data.force_compile;

		var config = {
			// Build temp config path
			path : path.join("/", "tmp", tmp),

			// Build config text, array => string conversion, etc
			rb : (function () {
				var lines = [],
					value, key;

				for (key in data) {
					if (data[key] !== null && typeof data[key] !== "undefined") {
						value = stringify(data[key]);
						lines.push(key + " = " + value);
					}
				}

				return lines.join("\n") + "\n";
			}())
		};

		// Write temporary file
		grunt.file.write(config.path, config.rb);
		grunt.verbose.writeln(config.rb);

		// If bundled call, prepend "exec", "compass" to arguments
		if (bundle) {
			args = ["exec", "compass"].concat(args);
		}

		// Add path to temp config file and path to sass directory
		args = args.concat(["--config", config.path, "--sass-dir", data.sass_dir]);

		// If force is true, append parameter
		if (force) {
			args.push("--force");
		}

		// In verbose mode, write args
		grunt.verbose.subhead(["Running:", cmd].concat(args).join(" "));

		// Run the command
		var child = cp.spawn(cmd, args, {
			stdio: "inherit"
		});

		// Clean up on exit
		child.on("exit", done);
	});
};
