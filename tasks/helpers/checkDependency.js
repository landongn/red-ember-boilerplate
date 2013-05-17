/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var checkDependency = function (dep, cb) {
		var semver = require("semver");
		var cp = require("child_process");

		var warning;

		cp.exec(dep.bin + " --version", function (err, result, code) {
			var data = result.toString();

			if (err) {
				if (err.toString().indexOf("No such file or directory") !== -1 || err.toString().indexOf("not found") !== -1) {
					dep.error = ("No executable named " + dep.bin.bold.underline + " was found").red;
					warning = dep;
				} else if (dep.version !== "*") {
					grunt.fail.warn((err.stderr || err.stdout || err).toString());
				}
			} else if (data.length) {
				var tagRegExp = new RegExp(
					"\\s*[v=]*\\s*([0-9]+)" +            // major
					"\\.([0-9]+)"  +                     // minor
					"(?:\\.([0-9]+))?" +                 // patch
					"(-[0-9]+-?)?" +                     // build
					"([a-zA-Z-+][a-zA-Z0-9-\\.:]*)?"     // tag
				);

				var match = (data.match(tagRegExp) || []),
					installed, i, j, newVer = [];

				// Pip being dumb.
				if (match.length && typeof match[3] === "undefined") {
					match[3] = "0";

					for (i = 1, j = match.length; i < j; i++) {
						if (typeof match[i] !== "undefined") {
							newVer.push(match[i]);
						}
					}

					match[0] = newVer.join(".");
				}

				installed = semver.clean(match[0]) || "0.0.0";
				if (!semver.satisfies(installed, dep.version)) {
					dep.installedVersion = installed;
					warning = dep;
				}
			}

			if (cb) {
				cb(warning);
			}
		});
	};

	return checkDependency;

};
