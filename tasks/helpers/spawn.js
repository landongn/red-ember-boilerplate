/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("spawn", function (opts) {
		var cp = require("child_process");
		var isVerbose = grunt.option("verbose");

		var err = "";
		var out = "";

		var child = cp.spawn(opts.cmd, opts.args, {
			stdio: isVerbose ? "inherit" : "pipe",
			cwd: opts.cwd
		});

		if (!isVerbose && !grunt.option("quiet")) {
			if (opts.title) {
				grunt.helper("write", opts.title.grey);
			}

			grunt.log.write(".".grey);

			child.stdout.on("data", function (data) {
				grunt.log.write(".".grey);
				out += data.toString();
			});

			if (opts.cmd !== "npm") {
				child.stderr.on("data", function (data) {
					err += data.toString();
				});
			} else {
				child.stderr.on("data", function () {
					grunt.log.write(".".grey);
				});
			}
		}

		child.on("exit", function (code) {
			if (!isVerbose) {
				if (!grunt.option("quiet")) {
					grunt.log.write("..".grey);
				}

				if (code === 0) {
					if (!grunt.option("quiet")) {
						grunt.log.ok();
					}
				} else {
					grunt.log.write("ERR".red);

					if (err) {
						grunt.log.write("\n\n");
						grunt.fail.fatal(err);
					}
				}
			}

			if (opts.complete) {
				opts.complete(code, err, out);
			}
		});
	});

};
