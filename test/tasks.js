/*jshint node:true*/
/*global describe, before, it*/

// Travis test #1
"use strict";

var fs = require("fs");
var path = require("path");
var colors = require("colors");
var cwd = process.cwd();

var expect = require("expect.js");
var nexpect = require("nexpect");
var grunt = require("./lib/grunt");

var test = path.join(cwd, "build");
var pkg = require(path.join(cwd, "package.json"));
var repositoryUrl = pkg.repository.url;

describe("Default Tasks", function () {

	// Start a pristine Robyn project
	// This test expects a Robyn nest called 'robyn-test'
	// Add: `robyn add robyn-test git://github.com/ff0000/robyn.git`
	before(function (done) {
		var afterBefore = function () {
			if (fs.existsSync(test)) {
				done();
			} else {
				nexpect.spawn("robyn", [
					"init", "robyn-test", test,
					"--name", "robynTest",
					"--title", "Robyn Test"
				], {
					stripColors: true,
					verbose: true
				})
				.wait("[*] Project shell complete.")

				.expect('Running "start" task')

				.expect('[*] Starting the party')
				.expect('    Installing npm modules').wait('OK')

				.expect("[*] Checking for available plugins.")
				.expect("    Found the following: caboose, modernizr, red-start, rosy, statix")

				.expect("[*] Checking param overrides.")
				.expect("    project name: robynTest, project title: Robyn Test")

				.expect("Please answer the following:")

				.expect("[?] Would you like to add caboose (RED Interactive's internal SASS + Compass framework)? (Y/n) ")
				.sendline("Y")

				.expect("[?] Would you like to add modernizr (Build out a lean, mean Modernizr machine.)? (Y/n) ")
				.sendline("Y")

				.expect("[?] Would you like to add red-start (Easy creation of Django projects and applications based the layout used at RED Interactive Agency.)? (Y/n) ")
				.sendline("Y")

				.expect("[?] Would you like to add rosy (An inheritable / extendable JavaScript framework.)? (Y/n) ")
				.sendline("Y")

				.expect("[?] Would you like to add statix (Statix is a static website generator.)? (Y/n) ")
				.sendline("Y")

				.expect("[?] Do you need to make any changes to the above before continuing? (y/N) ")
				.sendline("N")

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

				.expect("Done, without errors.")

				.run(done);
			}
		};

		process.stdout.write("    Checking for Robyn...".grey);

		nexpect.spawn("robyn", ["list", "robyn-test"], {
			stripColors: true
		})
		.expect("robyn-test at")
		.expect("On branch")
		.run(function (err) {
			if (err) {
				process.stdout.write("\n".green);
				process.stdout.write("    Adding robyn-test...".grey);

				var url = repositoryUrl;
				nexpect.spawn("robyn", ["add", "robyn-test", url], {
					stripColors: true
				})
				.expect("Added nest robyn-test at %u".replace("%u", url))
				.expect("On branch:")
				.run(function (err) {
					if (err) {
						done(err);
					} else {
						process.stdout.write("OK\n".green);
						afterBefore();
					}
				});
			} else {
				process.stdout.write("OK\n".green);
				afterBefore();
			}
		});
	});

	describe("Setup Check", function () {
		it("should be a git repository", function (done) {
			nexpect.spawn("git", ["status"], {
				cwd: test,
				stripColors: true
			})
			.expect("On branch master")
			.run(done);
		});

		it("should have .robyn as submodule", function (done) {
			nexpect.spawn("git", ["submodule", "summary"], {
				cwd: test,
				stripColors: true
			})
			.expect("* .robyn")
			.run(done);
		});

		describe("File structure", function () {
			var files = [
				".editorconfig",
				".gitignore",
				".gitmodules",
				".robyn",
				"README.md",
				"grunt.js",
				"node_modules",
				"node_modules/colors",
				"node_modules/prompt",
				"node_modules/wrench",
				"package.json",
				"robyn",
				"robyn/config",
				"robyn/tasks",
				"robyn.json"
			];

			var checkExists = function (file) {
				it(file, function (done) {
					var exists = fs.existsSync(path.join(test, file));
					expect(exists).to.be.ok();
					done();
				});
			};

			for (var i = 0, j = files.length; i < j; i++) {
				checkExists(files[i]);
			}
		});
	});

	describe("start", function () {
		it("grunt start", function (done) {
			grunt.spawn("start")
			.wait("[*] Starting the party")
			.expect("Installing npm modules")
			.wait("OK")
			.expect("[*] This party's already been started. You can install individual plugins with `grunt install`")
			.run(done);
		});
	});

	describe("default", function () {
		it("grunt", function (done) {
			grunt.spawn()
			.wait("Running \"default\" task")
			.expect("Running \"tasks\" task")
			.run(done);
		});
	});

	describe("info", function () {
		it("grunt info", function (done) {
			grunt.spawn("info")
			.wait("[*] robyn version: 3.0.0")
			.expect("via " + repositoryUrl)
			.run(done);
		});
	});

	describe("install", function () {
		it("grunt install", function (done) {
			grunt.spawn("install")
			.wait("Install plugins with grunt")
			.expect("[*] Installed plugins:")
			.run(function (err) {
				if (err) {
					done(err);
				}

				grunt.spawn("install")
				.wait("Done, without errors.")
				.run(done);
			});
		});
	});

	describe("update", function () {
		it("grunt update", function (done) {
			grunt.spawn("update")
			.wait("Updating .robyn")
			.expect(".")
			.wait("OK")
			.expect("Done, without errors.")
			.run(done);
		});
	});
});
