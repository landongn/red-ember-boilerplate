/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("check_dependency", function (dep, cb) {
		// TODO: ditch this when grunt v0.4 is released
		grunt.util = grunt.util || grunt.utils;

		if (!dep.version || dep.version === "*") {
			if (cb) {
				return cb();
			}
		}

		var match = dep.version.match(/(?:([<>=]+)?(?:\s+)?)([\d\.]+)/);

		var range = match[1];
		var requiredVersion = match[2];

		var warning;

		grunt.util.spawn({
			cmd: dep.bin,
			args: ["--version"]
		}, function (err, result, code) {
			var data = result.toString();

			if (err) {
				if (~ err.toString().indexOf("No such file or directory")) {
					dep.error = ("No executable named " + dep.bin.bold.underline + " was found.").red;
					warning = dep;
				} else {
					grunt.fail.warn((err.stderr || err.stdout || err).toString());
				}
			} else if (data.length) {
				var installedVersion = data.replace(/x/g, "0").match(/[\d\.]+/).join("");

				while (installedVersion.split(".").length < 3) {
					installedVersion += ".0";
				}

				dep.installedVersion = installedVersion;

				var iBits = installedVersion.split("."),
					iMajor = iBits[0],
					iMinor = iBits[1],
					iPatch = iBits[2];

				var rBits = requiredVersion.split("."),
					rMajor = rBits[0],
					rMinor = rBits[1],
					rPatch = rBits[2];

				switch (range) {
				case ">":
					if (iMajor <= rMajor && iMinor <= rMinor && iPatch <= rPatch) {
						warning = dep;
					}
					break;

				case ">=":
					if (iMajor < rMajor && iMinor < rMinor && iPatch < rPatch) {
						warning = dep;
					}
					break;

				case "<":
					if (iMajor >= rMajor && iMinor >= rMinor && iPatch >= rPatch) {
						warning = dep;
					}
					break;

				case "<=":
					if (iMajor > rMajor && iMinor > rMinor && iPatch > rPatch) {
						warning = dep;
					}
					break;

				default:
					if (iMajor !== rMajor && iMinor !== rMinor && iPatch !== rPatch) {
						warning = dep;
					}
					break;
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
			iterator.push({
				plugin : plugPkg.name || pkg.name,
				bin : bin,
				version : sysDeps[bin]
			});
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
							console.warn("[!] ".yellow + warn.plugin.cyan + " requires " + (warn.bin + " " + warn.version).yellow +
							". " + (warn.error || "You are on version " + warn.installedVersion.red.bold + "."));
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
