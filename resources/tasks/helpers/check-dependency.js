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
					console.error(err.toString());

					if (cb) {
						cb(true);
					}
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

};
