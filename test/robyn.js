/* jshint node: true */
module.exports = {
	check : function (callback) {
		var fs = require("fs");
		var cwd = process.cwd();
		var path = require("path");
		var nexpect = require("nexpect");

		var test = path.join(cwd, "build");
		var pkg = require(path.join(cwd, "package.json"));
		var repositoryUrl = pkg.repository.url;

		var afterBefore = function () {
			if (fs.existsSync(test)) {
				var wrench = require("wrench");
				wrench.rmdirSyncRecursive(test);
			}

			nexpect.spawn("git", [
				"rev-parse",
				"--abbrev-ref",
				"HEAD"
			]).run(function (err, result) {
				var branch = (process.env.TRAVIS_BRANCH || (result || "")).toString();

				nexpect.spawn("robyn", [
					"init", "robyn-test", test,
					"--branch", branch.trim(),
					"--name", "robynTest",
					"--title", "Robyn Test",
					"--all"
				], {
					stripColors: true,
					verbose: true
				})
				.wait("[*] Bootstrapping robyn")
				.expect("Using: robyn-test at")
				.wait("OK")
				.expect("Adding robyn")
				.wait("OK")
				.expect("[*] Project shell complete.")
				.wait("[*] You should edit your package.json and fill in your project details.")
				.expect("[*] All done! Commit you changes and you're on your way.")
				.run(function (err) {
					if (err) {
						console.error(err);
						process.exit();
					}

					callback();
				});
			});
		};

		nexpect.spawn("robyn", ["list", "robyn-test"], {
			stripColors: true
		})
		.expect("robyn-test at")
		.expect("On branch")
		.run(function (err) {
			if (err) {
				var url = process.env.TRAVIS ? repositoryUrl : cwd;
				nexpect.spawn("robyn", ["add", "robyn-test", url], {
					stripColors: true
				})
				.expect("Added nest robyn-test at %u".replace("%u", url))
				.expect("On branch:")
				.run(function (err) {
					if (err) {
						console.error(err);
						process.exit();
					} else {
						afterBefore();
					}
				});
			} else {
				afterBefore();
			}
		});
	}
};
