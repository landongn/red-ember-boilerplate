/* jshint node:true */
module.exports = function (grunt) {

	grunt.registerTask("server", "An alias for Python's runserver", function () {
		var cwd = process.cwd();
		var path = require("path");

		var fs = require("fs");
		var cp = require("child_process");
		var colors = require("colors");

		var args = grunt.util.toArray(arguments);
		var done = this.async();

		var port = "8000",
			ip = "0.0.0.0",
			nowatch = false;

		args.forEach(function (arg) {
			if (/^[\d]+\.[\d]+\.[\d]+\.[\d]+$/.test(arg)) {
				ip = arg;
			}

			if (/^[\d]+$/.test(arg)) {
				port = arg;
			}

			if (/^nowatch$/.test(arg)) {
				nowatch = arg;
			}
		});

		var cmd = ip + ":" + port;

		var activate = path.join("env", "bin", "activate");
		var setup = path.join("scripts", "setup.sh");
		var sync = path.join("scripts", "sync.sh");
		var server = path.join("scripts", "run.sh");

		var runOnce;

		var startWatcher = function (cb, done) {
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
			if (fs.existsSync(setup)) {
				var args = [server, cmd];
				var verbose = grunt.option("verbose");

				var frontend = path.join("project", "settings", "frontend.py");

				if (fs.existsSync(frontend)) {
					args.push("--settings=settings.frontend");
				}

				if (verbose) {
					grunt.log.writeln(args.join(" "));
				}

				grunt.log.ok("Starting the server...".bold.cyan);

				var runner = cp.spawn("sh", args, {
					stdio: "inherit"
				});

				runner.on("exit", function (code) {
					if (watcher && typeof (watcher || {}).kill === "function") {
						watcher.kill();
					}

					done(!!code);
				});
			} else {
				console.error("No run script found. Aborting.");
				process.exit();
			}
		};

		var syncProject = function () {
			if (fs.existsSync(sync)) {
				var child = cp.spawn("sh", [sync], {
					stdio: "inherit"
				});

				child.on("exit", function (code) {
					if (code !== 0) {
						process.exit();
					} else if (!nowatch) {
						startWatcher(runProject, done);
					} else {
						runProject();
					}
				});
			} else if (!nowatch) {
				startWatcher(runProject, done);
			} else {
				runProject();
			}
		};

		var setupProject = function () {
			if (fs.existsSync(setup)) {
				var child = cp.spawn("sh", [setup], {
					stdio: "inherit"
				});

				child.on("exit", function (code) {
					if (code !== 0) {
						process.exit();
					} else {
						syncProject();
					}
				});
			} else {
				console.error("No setup script found. Aborting.");
				process.exit();
			}
		};

		if (!fs.existsSync(activate)) {
			setupProject();
		} else if (!nowatch) {
			startWatcher(runProject, done);
		} else {
			runProject();
		}
	});

};
