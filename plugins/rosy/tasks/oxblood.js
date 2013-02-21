/*jslint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		path = require("path"),
		rosy = require(path.join(__dirname, "../plugin.json")),
		output = "project/static/js",
		source = rosy.config.scope;

	grunt.registerTask("oxblood", "Run Rosy + Mocha unit tests", function (mode) {
		var done = this.async();

		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");
		var cwd = process.cwd();
		var pkg = require(path.join(cwd, "package.json"));

		var jsDir = output;
		var runner = path.join(jsDir, "test/runner.js");

		if (!fs.existsSync(path.join(cwd, runner))) {
			grunt.fail.warn("OxBlood not found.");
			process.exit();
		}

		var devDeps = Object.keys(pkg.devDependencies).filter(function (dep) {
			return !fs.existsSync("./node_modules/" + dep);
		}).map(function (dep) {
			return [dep, pkg.devDependencies[dep]].join("@");
		});

		var runTests = function () {
			var child = cp.spawn("node", [runner, "-m", mode, "-r", jsDir], {
				env: null,
				setsid: true,
				stdio: "inherit"
			});

			child.addListener("exit", function (code) {
				if (code !== 0) {
					grunt.fail.warn("");
				}

				done();
			});
		};

		var installDependencies = function () {
			var child = cp.spawn("npm", ["install"].concat(devDeps), {
				env: null,
				setsid: true,
				stdio: "inherit"
			});

			child.addListener("exit", runTests);
		};

		if (devDeps.length) {
			installDependencies();
		} else {
			runTests();
		}

	});

};
