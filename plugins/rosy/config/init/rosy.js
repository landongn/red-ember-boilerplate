/*jslint node: true */
"use strict";

module.exports = function (grunt, helper, cb) {
	var fs = require("fs"),
		path = require("path"),
		pkgPath = path.join(__dirname, "..", "..", "plugin.json"),
		pkg = require(pkgPath),
		source = pkg.config.scope,
		cwd = process.cwd(),
		wrench = require("wrench");

	var installExternalScripts = function () {
		var bower = require("bower");
		var _ = grunt.util._;

		// Change directory to Rosy root
		if (!fs.existsSync(path.join(cwd, source))) {
			wrench.mkdirSyncRecursive(path.join(cwd, source));
		}

		process.chdir(path.join(cwd, source));

		// Read .bowerrc settings into bower.config
		var rc = JSON.parse(fs.readFileSync(path.join(cwd, source, ".bowerrc")));
		_.extend(bower.config, rc);

		var title;

		// Install libs
		bower.commands.install([
			"https://github.com/ff0000/rosy.git#1.0.0-bower",
			"https://github.com/rosy-components/rosy-google-chrome-frame.git",
			"https://github.com/rosy-components/example.git"
		]).on("data", function (data) {
			if (grunt.option("verbose")) {
				process.stdout.write("    " + data);
			} else {
				if (!title) {
					title = "Fetching external libraries";
					process.stdout.write("    " + title.grey);
				}

				process.stdout.write(".".grey);
			}
		}).on("end", function (data) {
			if (!grunt.option("verbose")) {
				process.stdout.write("OK".green + "\n");
			}

			process.chdir(cwd);

			var libs = path.join(cwd, source, "libs");
			var project = path.join(libs, "example");

			// Get rid of all the cruft. Ugh.
			var f = [
				path.join(libs, "handlebars.js", "*[^dist]"),
				path.join(libs, "jquery.transit", "*"),
				path.join(libs, "jquery", "*"),
				path.join(libs, "json3", "*[^lib]"),
				path.join(libs, "modernizr", "*"),
				path.join(libs, "requirejs", "*"),
				path.join(libs, "**", "test{,s}"),
				path.join("!", libs, "handlebars.js", "dist", "handlebars.js"),
				path.join("!", libs, "jquery.transit", "jquery.transit.js"),
				path.join("!", libs, "jquery", "jquery.js"),
				path.join("!", libs, "json3", "lib", "json3.js"),
				path.join("!", libs, "modernizr", "modernizr.js"),
				path.join("!", libs, "requirejs", "require.js")
			];

			var cruft = grunt.file.expand({
				dot: true
			}, f).forEach(function (file) {
				if (fs.existsSync(file)) {
					grunt.file.delete(file);
				}
			});

			if (fs.existsSync(project)) {
				var robynPkg = require(path.join(cwd, "robyn.json"));
				var localPkg = require(path.join(robynPkg.config.dirs.robyn, "tasks", "utils", "pkg"));

				var bowerConfig = path.join(project, "bower.json");

				if (!fs.existsSync(bowerConfig)) {
					bowerConfig = path.join(project, "component.json");
				}

				if (fs.existsSync(bowerConfig)) {
					fs.unlinkSync(bowerConfig);
				}

				wrench.copyDirSyncRecursive(project, path.join(cwd, source, localPkg.config.vars.PROJECT_NAME));
				wrench.rmdirSyncRecursive(project);
			}

			return ignoreTests();
		});
	};

	var ignoreTests = function () {
		var ignorepath = path.join(cwd, source),
			ignorefile = path.join(ignorepath, ".jshintignore");

		if (!fs.existsSync(ignorefile)) {
			return exit();
		}

		var newcontent = fs.readFileSync(ignorefile).toString().trim();
		newcontent += "\n" + "test" + "\n";

		fs.writeFileSync(ignorefile, newcontent);
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
