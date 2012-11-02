/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("push:apply", function (branch) {
		var done = this.async();
		var cp = require("child_process");

		var err = "";

		var cmd = "git";
		var args = ["remote", "show", "origin"];

		var child = cp.spawn(cmd, args, {
			stdio: "pipe"
		});

		child.stderr.on("data", function (data) {
			err += data.toString();
		});

		child.on("exit", function (code) {
			if (err) {
				grunt.fail.warn(err);
			}

			args = ["push", "origin", branch];

			child = cp.spawn(cmd, args, {
				stdio: "pipe"
			});

			process.stdout.pipe(child.stdout);

			child.stderr.on("data", function (data) {
				err += data.toString();
			});

			child.on("exit", function (code) {
				if (err) {
					grunt.fail.warn(err);
				}

				done();
			});
		});
	});

	grunt.registerTask("push", "Push changes upstream.", function (branch) {
		var done = this.async();
		var cp = require("child_process");
		var tasks = ["push:apply:"];

		if (!branch) {
			var out = "";
			var err = "";

			var cmd = "git";
			var args = ["rev-parse", "--abbrev-ref", "HEAD"];

			var child = cp.spawn(cmd, args, {
				stdio: "pipe"
			});

			child.stdout.on("data", function (data) {
				out += data.toString();
			});

			child.stderr.on("data", function (data) {
				err += data.toString();
			});

			child.on("exit", function (code) {
				if (err) {
					grunt.fatal(err);
				}

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
