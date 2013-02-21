/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {
	var fs = require("fs"),
		path = require("path"),
		pkgPath = path.join(__dirname, "..", "..", "plugin.json"),
		pkg = require(pkgPath),
		source = pkg.config.scope,
		cwd = process.cwd();

	var installExternalScripts = function () {
		var installpath = path.join(cwd, source, "libs/_install");

		if (!fs.existsSync(path.join(installpath, "installer.js"))) {
			return exit();
		}

		grunt.helper("spawn", {
			cmd: "node",
			args: [path.join(installpath, "installer.js")],
			title: "Installing external libraries",
			complete: function (code) {
				if (code !== 0) {
					return exit("An error occurred while installing external libraries.");
				}

				return ignoreTests(installpath);
			}
		});
	};

	var ignoreTests = function (installpath) {
		var ignorepath = path.join(cwd, source),
			ignorefile = path.join(ignorepath, ".jshintignore");

		if (!fs.existsSync(ignorefile)) {
			return exit();
		}

		var newcontent = fs.readFileSync(ignorefile).toString().trim();
		newcontent += "\n" + "test" + "\n";

		fs.writeFileSync(ignorefile, newcontent);
		return cleanupFiles(installpath);
	};

	var cleanupFiles = function (installpath) {
		if (fs.existsSync(installpath)) {
			var installer = path.join(installpath, "installer.js");
			var config = path.join(installpath, "libs.config.js");

			if (fs.existsSync(installer)) {
				fs.unlinkSync(installer);
			}

			if (fs.existsSync(config)) {
				fs.unlinkSync(config);
			}

			fs.rmdirSync(installpath);
		}

		return exit();
	};

	var exit = function (error) {
		if (cb) {
			cb(error);
		} else {
			process.exit();
		}
	};

	installExternalScripts();
};
