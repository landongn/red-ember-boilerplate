/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("push:apply", function (branch) {
		var done = this.async();
		var cp = require("child_process");

		var cmd = "git";
		var args = ["push", "origin", branch];

		var child = cp.spawn(cmd, args, {
			stdio: "inherit"
		});

		child.on("exit", function (code) {
			if (code !== 0) {
				grunt.fail.warn(code);
			}

			done();
		});
	});

	grunt.registerTask("push", "Push changes upstream.", function (branch) {
		var done = this.async();
		var cp = require("child_process");
		var tasks = ["push:apply:"];

		if (!branch) {
			var out = "";

			var cmd = "git";
			var args = ["rev-parse", "--abbrev-ref", "HEAD"];

			var child = cp.spawn(cmd, args, {
				stdio: "pipe"
			});

			child.stdout.on("data", function (data) {
				out += data;
			});

			child.on("exit", function (code) {
				out = out.trim() || "master";
				tasks[0] += out;

				if (out === "develop" || out === "master") {
					tasks.unshift("build");
				}

				grunt.task.run(tasks);
				done();
			});
		} else {
			tasks[0] += branch;

			if (branch === "develop" || branch === "master") {
				tasks.unshift("build");
			}

			grunt.task.run(tasks);
			done();
		}
	});

};
