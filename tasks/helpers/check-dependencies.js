/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("check_dependency", function (dep, cb) {
		// TODO: ditch this when grunt v0.4 is released
		grunt.util = grunt.util || grunt.utils;

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
	});

	grunt.registerHelper("check_dependencies", function (plugPkg, success, failure) {
		var pkg = require("../utils/pkg");
		var localPkg = require("../utils/local-pkg");
		var sysDeps = plugPkg.systemDependencies || plugPkg;

		var iterator = [];
		var warnings = [];
		var i = 0;

		for (var bin in sysDeps) {
			var meta = {
				plugin : plugPkg.name || pkg.name,
				bin : bin,
				version : sysDeps[bin].version || sysDeps[bin]
			};

			if (typeof sysDeps[bin] === typeof {}) {
				meta.data = sysDeps[bin];
			}

			iterator.push(meta);
		}

		(function check(i) {
			var dep = iterator[i];

			grunt.helper("check_dependency", dep, function (warning) {
				if (warning) {
					if (warning === true && failure) {
						failure(warning);
					} else {
						warnings.push(warning);
					}
				}

				if (iterator[++i]) {
					check(i);
				} else {
					var j, k, warn;

					if (warnings.length) {
						var prompt = require("prompt");
						prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
						prompt.delimiter = prompt.delimter || " ";

						for (j = 0, k = warnings.length; j < k; j++) {
							warn = warnings[j];

							if (!warn || (!warn.installedVersion && !warn.error)) {
								continue;
							}

							console.warn([
								"[!] ".yellow + warn.plugin.cyan + (" requires " + warn.bin + " " + warn.version).yellow,
								(warn.error || "You are on version " + warn.installedVersion.red.bold),
								warn.data ? ("\n    Install: " + warn.data.install + "\n    Upgrade: " + warn.data.upgrade).grey : ""
							].join(". "));
						}

						grunt.log.writeln();

						prompt.start();

						prompt.get([{
							name: "force",
							message: "WARNING: ".yellow + (warnings.length + " compatibility warning" + (warnings.length > 1 ? "s were" : " was") +
							" found. This might lead to issues later on. Are you sure you want to continue?").magenta,
							validator: /[y\/n]+/i,
							"default": "Y/n"
						}], function (err, props) {
							var assert = grunt.helper("get_assertion", props.force);

							if (assert) {
								localPkg.config.warnings = localPkg.config.warnings || [];
								localPkg.config.warnings = localPkg.config.warnings.concat(warnings);
								localPkg.save();

								if (success) {
									success(plugPkg.name);
								}
							} else if (failure) {
								failure(true);
							}
						});
					} else if (success) {
						success(plugPkg.name);
					}
				}
			});
		}(i));
	});

};
