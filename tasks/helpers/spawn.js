/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var spawn = function (opts) {
		var helper = require("../helpers").init(grunt);

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
				helper.write(opts.title.grey);
			}

			grunt.log.write(".".grey);

			child.stdout.on("data", function (data) {
				grunt.log.write(".".grey);
				out += data.toString();
			});

			if (opts.cmd !== "npm" || opts.args[0] === "shrinkwrap") {
				child.stderr.on("data", function (data) {
					err += data.toString();
				});
			} else {
				child.stderr.on("data", function (data) {
					if (data.toString().indexOf("GET") === -1) {
						grunt.log.write(".".grey);
					}
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
	};

	return spawn;

};
