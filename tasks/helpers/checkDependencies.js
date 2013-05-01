/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var checkDependencies = function (plugPkg, success, failure) {
		var helper = require("../helpers").init(grunt);

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

			helper.checkDependency(dep, function (warning) {
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
							var assert = helper.getAssertion(props.force);

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
	};

	return checkDependencies;

};
