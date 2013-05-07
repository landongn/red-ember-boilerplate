/* jshint node:true */
module.exports = function (grunt) {

	grunt.registerTask("server", "An alias for Python's runserver", function () {
		var fs = require("fs");
		var cp = require("child_process");
		var path = require("path");

		var args = grunt.util.toArray(arguments);
		var done = this.async();

		var port = (args[1] || args[0]);
		var ip = (args[1] ? args[0] : null);
		var cmd = (ip || "0.0.0.0") + ":" + (port || "8000");

		var activate = path.join("env", "bin", "activate");
		var setup = path.join("scripts", "setup.sh");
		var sync = path.join("scripts", "sync.sh");
		var server = path.join("scripts", "run.sh");

		var child;

		var checkLiveReload = function () {
			var liveReloadUrl = "http://0.0.0.0:35729";
			var child = cp.exec("curl -I " + liveReloadUrl, function (err, stdout, stderr) {
				if (stderr.toString().indexOf("couldn't connect to host") !== -1) {
					console.log();
					grunt.log.subhead("Hey front-end developer!".yellow);
					grunt.log.warn("You should run `grunt watch` to enable LiveReload functionality".yellow);
					console.log();
				}

				runProject();
			});
		};

		var runProject = function () {
			if (fs.existsSync(setup)) {
				var args = [server, cmd];

				if (grunt.option("verbose")) {
					grunt.log.writeln(args.join(" "));
				}

				child = cp.spawn("sh", args, {
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
					done(!!code);
				});
			} else {
				console.error("No run script found. Aborting.");
				process.exit();
			}
		};

		var syncProject = function () {
			if (fs.existsSync(sync)) {
				child = cp.spawn("sh", [sync], {
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
					if (code !== 0) {
						process.exit();
					} else {
						checkLiveReload();
					}
				});
			} else {
				checkLiveReload();
			}
		};

		var setupProject = function () {
			if (fs.existsSync(setup)) {
				child = cp.spawn("sh", [setup], {
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
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
		} else {
			checkLiveReload();
		}
	});

};
