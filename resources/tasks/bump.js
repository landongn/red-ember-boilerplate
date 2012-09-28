/*global module:false*/

module.exports = function (grunt) {

	grunt.registerTask("bump", "Bump the version number", function (type) {
		var done = this.async();

		var cp = require("child_process"),
			pkg = require("./utils/pkg"),
			version = pkg.version.split(".");

		switch (type) {
			case "major":
				version[0]++;
				break;

			case "minor":
				version[1]++;
				break;

			default:
				version[2]++;
				break;
		}

		version = version.join(".");
		pkg.version = version;

		pkg.save();

		grunt.log.ok("Version bumped to %v".replace("%v", version));

		var child = cp.spawn("git", ["add", "package.json"], {
			stdio: "inherit"
		});

		child.on("exit", function () {
			child = cp.spawn("git", ["commit", "-m", version], {
				stdio: "pipe"
			});

			child.on("exit", function () {
				child = cp.spawn("git", ["tag", "-m", version, version], {
					stdio: "pipe"
				});

				child.on("exit", function () {
					grunt.log.ok("Done. Release is tagged and ready to push (git push --tags).");
					done();
				});
			});
		});

	});

};
