/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("check_dependency", function (dep, cb) {
		var match = dep.version.match(/(?:([<>=]+)?(?:\s+)?)([\d\.]+)/);

		var range = match[1];
		var requiredVersion = match[2];

		var warning;

		grunt.utils.spawn({
			cmd: dep.bin,
			args: ["--version"]
		}, function (err, result, code) {
			var data = result.toString();

			if (err) {
				if (~ err.toString().indexOf("No such file or directory")) {
					dep.error = ("No executable named " + dep.bin.bold.underline + " was found.").red;
					warning = dep;
				} else {
					grunt.fail.warn(err.stdout.toString());
				}
			} else if (data.length) {
				var installedVersion = data.match(/[\d\.]+/).join("");

				while (installedVersion.split(".").length < 3) {
					installedVersion += ".0";
				}

				dep.installedVersion = installedVersion;

				switch (range) {
				case ">":
					if (installedVersion <= requiredVersion) {
						warning = dep;
					}
					break;

				case ">=":
					if (installedVersion < requiredVersion) {
						warning = dep;
					}
					break;

				case "<":
					if (installedVersion >= requiredVersion) {
						warning = dep;
					}
					break;

				case "<=":
					if (installedVersion > requiredVersion) {
						warning = dep;
					}
					break;

				default:
					if (installedVersion !== requiredVersion) {
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
							console.warn("[!] ".yellow + warn.plugin.cyan + " requires " + (warn.bin + " " + warn.version).magenta +
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
