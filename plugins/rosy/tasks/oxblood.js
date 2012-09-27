/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("oxblood", "Run Rosy + Mocha unit tests", function (mode) {
		var done = this.async();

		var fs = require("fs");
		var cp = require("child_process");
		var pkg = require("./utils/pkg");

		var jsDir = "./project/static/js/";
		var runner = jsDir + "test/runner.js";

		if (!fs.existsSync(runner)) {
			console.error("OxBlood not found.");
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

			child.addListener("exit", function () {
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
