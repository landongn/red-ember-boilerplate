/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var cp = require("child_process"),
		path = require("path"),
		cwd = process.cwd(),
		pkg = require(path.join(cwd, "robyn.json")),
		configPath = path.join(cwd, pkg.dirs.config, "statix");

	var exec = function (exec, args, cwd, doneCB) {

		var child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			stdio: "inherit"
		});

		child.addListener("exit", function (code) {
			doneCB(!code);
		});
	};

	grunt.registerTask("statix:build", "Build with statix", function () {
		var done = this.async();

		exec("statix", ["build"], configPath, function (success) {
			done(1);
		});
	});

	grunt.registerTask("statix:server", "Run the statix server", function (p) {
		var port = p || 8000;
		var done = this.async();
		var projectPath = path.join(cwd, "project");

		exec("statix", ["server", "-p", port, "-d", projectPath], configPath, function (success) {
			done(1);
			process.exit();
		});
	});

};
