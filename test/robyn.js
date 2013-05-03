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
					"init", "rbp-test", test,
					"--branch", branch.trim(),
					"--name", "robynTest",
					"--title", "Robyn Test"
				], {
					stripColors: true,
					verbose: true
				})
				.wait("[*] Bootstrapping robyn")
				.expect("Using: rbp-test at")
				.wait("OK")
				.expect("Adding robyn")
				.wait("OK")
				.expect("[*] Project shell complete.")

				// RED Boilerplate
				.expect("Install npm modules").wait("OK")
				.expect('Running "start" task')

				.expect("[*] Starting the party")
				.expect("    Installing npm packages").wait("OK")

				.expect("[*] Checking for available plugins.")
				.expect("    Found the following: caboose, modernizr, red-start, rosy, scarlet, statix")

				.expect("[*] Checking param overrides.")
				.expect("    project name: robynTest, project title: Robyn Test")

				.expect("Please answer the following:")
				.expect("[?] Would you like to add caboose")
				.sendline("")
				.expect("[?] Would you like to add modernizr")
				.sendline("")
				.expect("[?] Would you like to add red-start")
				.sendline("")
				.expect("[?] Would you like to add rosy")
				.sendline("")
				.expect("[?] Would you like to add scarlet")
				.sendline("")
				.expect("[?] Would you like to add statix")
				.sendline("")
				.expect("[?] Do you need to make any changes to the above before continuing? (y/N)")
				.sendline("")

				.expect("[*] Stored and updated your project variables.")

				.expect("[+] Installing caboose via https://github.com/ff0000/caboose.git")
				.expect("    Cloning repository").wait("OK")
				.expect("    Copying files into project").wait("OK")
				.expect("    Installing bundle. This may take a minute").wait("OK")

				.expect("[+] Installing modernizr via .robyn/plugins/modernizr")
				.expect("    Installing npm packages").wait("OK")
				.expect("    Copying files into project").wait("OK")

				.expect("[+] Installing red-start via .robyn/plugins/red-start")
				.expect("    Copying files into project").wait("OK")
				.expect("    Creating a new red-start project").wait("OK")
				.expect("    Creating a virtualenv. This may take a minute").wait("OK")

				.expect("[+] Installing rosy via https://github.com/ff0000/rosy.git")
				.expect("    Installing npm packages").wait("OK")
				.expect("    Cloning repository").wait("OK")
				.expect("    Copying files into project").wait("OK")
				.expect("    Installing external libraries").wait("OK")

				.expect("[+] Installing scarlet via .robyn/plugins/scarlet")
				.expect("    Copying files into project").wait("OK")
				.expect("    Adding scarlet as a submodule").wait("OK")
				.expect("    Update submodule").wait("OK")

				.expect("[+] Installing statix via .robyn/plugins/statix")
				.expect("    Installing npm packages").wait("OK")
				.expect("    Copying files into project").wait("OK")

				.expect("[*] Shrinkwrapped npm packages.")

				.expect("[*] You should edit your package.json and fill in your project details.")
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

		nexpect.spawn("robyn", ["list", "rbp-test"], {
			stripColors: true
		})
		.expect("rbp-test at")
		.expect("On branch")
		.run(function (err) {
			if (err) {
				var url = process.env.TRAVIS ? repositoryUrl : cwd;
				nexpect.spawn("robyn", ["add", "rbp-test", url], {
					stripColors: true
				})
				.expect("Added nest rbp-test at %u".replace("%u", url))
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
