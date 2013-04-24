/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var cp = require("child_process"),
		path = require("path"),
		cwd = process.cwd(),
		pkg = require(path.join(cwd, "robyn.json")),
		configPath = path.join(cwd, pkg.config.dirs.config, "statix"),
		statixPkg = path.join(configPath, "statix.js");

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

		var statix = require("statix");
		statix.build(statixPkg);
	});

	grunt.registerTask("statix:server", "Run the statix server", function (p) {
		var statix = require("statix");

		var port = p || 8000;
		var done = this.async();

		var projectPaths = [
			path.join(cwd, "project", "templates"),
			path.join(cwd, "robyn", "config", "statix")
		].join(",");

		statix.server(statixPkg, projectPaths, port);

		process.on("exit", function () {
			done(1);
		});
	});

	// If RED Start is installed, it's considered the dominant plugin
	// Otherwise, map `grunt server` to statix
	var hasRedStart = !!(pkg.installedPlugins["red-start"]);

	if (!hasRedStart) {
		grunt.registerTask("server", ["statix:server"]);
	}
};
