/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var cwd = process.cwd();
	var path = require("path");

	var cp = require("child_process"),
		pkg = require(path.join(cwd, "robyn.json")),
		configPath = path.join(cwd, pkg.config.dirs.config, "statix"),
		statixPkg = path.join(configPath, "statix.js");

	var exec = function (exec, args, cwd, doneCB) {
		var child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			stdio: "inherit"
		});

		child.addListener("exit", function (code) {
			doneCB(!code);
		});
	};

	var server = function () {
		var args = grunt.util.toArray(arguments);
		var done = this.async();

		var port = "8000",
			nowatch = false;

		args.forEach(function (arg) {
			if (/^[\d]+$/.test(arg)) {
				port = arg;
			}

			if (/^nowatch$/.test(arg)) {
				nowatch = arg;
			}
		});

		var runOnce;

		var startWatcher = function (cb, done) {
			var watch = grunt.config.get("watch");

			if (typeof watch === "undefined") {
				grunt.log.ok("Nothing to watch...".bold.cyan);
				return cb();
			}

			var cp = require("child_process");

			var watcher = cp.spawn("grunt", ["watch"], {
				stdio: "pipe"
			});

			watcher.stdout.on("data", function (data) {
				var string = data.toString();
				var buffer = new Array(3).join("\n");

				if (string.indexOf('Running "watch" task') !== -1) {
					console.log();
					grunt.log.ok("Now watching for file changes...".bold.cyan);
				}

				if (string.indexOf("OK") !== -1) {
					process.stdout.write(buffer);
				}

				process.stdout.write(data);

				if (string.indexOf("Waiting...") !== -1) {
					console.log("\n");

					if (!runOnce && cb) {
						cb(watcher);
						runOnce = true;
					}
				}
			});

			watcher.stdout.on("error", done);
		};

		var runProject = function (watcher) {
			var statix = require("statix");

			var projectPaths = [
				path.join(cwd, "project", "templates"),
				path.join(cwd, "robyn", "config", "statix")
			].join(",");

			statix.server(statixPkg, projectPaths, port);

			process.on("exit", function (code) {
				if (watcher && typeof (watcher || {}).kill === "function") {
					watcher.kill();
				}

				done(!!code);
			});
		};

		if (!nowatch) {
			startWatcher(runProject, done);
		} else {
			runProject();
		}
	};

	grunt.registerTask("statix:build", "Build with statix", function () {
		var done = this.async();

		var statix = require("statix");
		statix.build(statixPkg);
	});

	grunt.registerTask("statix:server", "Run the statix server", server);

	// If RED Start is installed, it's considered the dominant plugin
	// Otherwise, map `grunt server` to statix
	var hasRedStart = !!(pkg.installedPlugins["red-start"]);

	if (!hasRedStart) {
		grunt.registerTask("server", server);
	}
};
