/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("spawn", function (opts) {
		var cp = require("child_process");
		var isVerbose = grunt.option("verbose");
		var err = [];

		var child = cp.spawn(opts.cmd, opts.args, {
			stdio: isVerbose ? "inherit" : "pipe"
		});

		if (!isVerbose) {
			if (opts.title) {
				grunt.helper("write", opts.title.grey);
			}

			grunt.log.write(".".grey);

			child.stdout.on("data", function () {
				grunt.log.write(".".grey);
			});

			if (opts.cmd !== "npm") {
				child.stderr.on("data", function (data) {
					err.push(data.toString());
				});
			} else {
				child.stderr.on("data", function () {
					grunt.log.write(".".grey);
				});
			}
		}

		child.on("exit", function (code) {
			if (!isVerbose) {
				grunt.log.write("..".grey);

				if (code === 0) {
					grunt.log.ok();
				} else {
					grunt.log.write("ERR".red);

					if (err.length) {
						grunt.log.write("\n\n");
						grunt.log.write(err.join("\n").yellow);
					}
				}
			}

			if (opts.complete) {
				opts.complete(code);
			}
		});
	});

};
