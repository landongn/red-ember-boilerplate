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
				callback();
			} else {
				nexpect.spawn("robyn", [
					"init", "rbp-test", test,
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
				.expect('Running "start" task')

				.expect("[*] Starting the party")
				.expect("    Installing npm modules").wait("OK")

				.expect("[*] Checking for available plugins.")
				.expect("    Found the following: caboose, modernizr, red-start, rosy, statix")

				.expect("[*] Checking param overrides.")
				.expect("    project name: robynTest, project title: Robyn Test")

				.expect("Please answer the following:")
				.expect("[?] Would you like to add caboose (RED Interactive's internal SASS + Compass framework)? (Y/n)")
				.sendline("")
				.expect("[?] Would you like to add modernizr (Build out a lean, mean Modernizr machine.)? (Y/n)")
				.sendline("")
				.expect("[?] Would you like to add red-start (Easy creation of Django projects and applications based the layout used at RED Interactive Agency.)? (Y/n)")
				.sendline("")
				.expect("[?] Would you like to add rosy (An inheritable / extendable JavaScript framework.)? (Y/n)")
				.sendline("")
				.expect("[?] Would you like to add statix (Statix is a static website generator.)? (Y/n)")
				.sendline("")
				.expect("[?] Do you need to make any changes to the above before continuing? (y/N)")
				.sendline("")

				.expect("[*] Stored and updated your project variables.")

				.expect("[+] Installing caboose via https://github.com/ff0000/caboose.git")
				.expect("    Cloning repository").wait("OK")
				.expect("    Copying files into project").wait("OK")
				.expect("    Installing bundle. This may take a minute").wait("OK")

				.expect("[+] Installing modernizr via .robyn/plugins/modernizr")
				.expect("    Installing npm modules").wait("OK")
				.expect("    Copying files into project").wait("OK")

				.expect("[+] Installing red-start via .robyn/plugins/red-start")
				.expect("    Copying files into project").wait("OK")
				.expect("    Creating a new red-start project").wait("OK")
				.expect("    Creating a virtualenv. This may take a minute").wait("OK")

				.expect("[+] Installing rosy via https://github.com/ff0000/rosy.git")
				.expect("    Installing npm modules").wait("OK")
				.expect("    Cloning repository").wait("OK")
				.expect("    Copying files into project").wait("OK")
				.expect("    Installing external libraries").wait("OK")

				.expect("[+] Installing statix via .robyn/plugins/statix")
				.expect("    Copying files into project").wait("OK")

				.expect("[*] You should edit your package.json and fill in your project details.")
				.expect("[*] All done! Commit you changes and you're on your way.")
				.run(function (err) {
					if (err) {
						console.error(err);
						process.exit();
					}

					callback();
				});
			}
		};

		nexpect.spawn("robyn", ["list", "rbp-test"], {
			stripColors: true
		})
		.expect("rbp-test at")
		.expect("On branch")
		.run(function (err) {
			if (err) {
				var url = repositoryUrl;
				nexpect.spawn("robyn", ["add", "rbp-test", url, "--branch", "feature/robyn"], {
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
