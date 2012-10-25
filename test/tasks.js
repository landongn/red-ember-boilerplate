/*jshint node:true*/
/*global describe, before, it*/

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

	describe("robyn.json integrity", function () {
		var robynPath = path.join(test, "robyn.json");
		var robynPkg = require(robynPath);

		it("should exist in file path", function (done) {
			expect(fs.existsSync(robynPath)).to.be.ok();
			done();
		});

		it("should be a valid object", function (done) {
			expect(robynPkg).to.be.an("object");
			done();
		});

		it("should be called robyn", function () {
			expect(robynPkg.name).to.equal("robyn");
		});

		it("should have a description", function () {
			expect(robynPkg.description).to.be.ok();
		});

		it("should follow semver versioning", function () {
			expect(robynPkg.version).to.match(/[\d]+\.[\d]+\.[\d]+/);
		});

		it("should point to a valid repository", function () {
			expect(robynPkg.repository).to.be.an("object");
			expect(robynPkg.repository.type).to.equal("git");
			expect(robynPkg.repository.url).to.match(/(^((git@)|(http(s)|git):\/\/)(.*)\.git$)|(^$)/);
		});

		it("should have a config object", function () {
			expect(robynPkg.config).to.be.an("object");
		});

		describe("should point to valid directories", function () {
			var dirs = robynPkg.config.dirs;
			expect(robynPkg.config.dirs).to.be.an("object");

			var doTest = function (key) {
				it(key, function (done) {
					expect(fs.existsSync(path.join(test, dirs[key]))).to.be.ok();
					done();
				});
			};

			for (var key in dirs) {
				doTest(key);
			}
		});

		it("should be initialized", function () {
			expect(robynPkg.initialized).to.be.ok();
		});
	});

	describe("Clone Check", function () {
		var clone = path.join(cwd, "clone");

		before(function (done) {
			nexpect.spawn("git", ["add", "--all"], {
				cwd: test,
				stripColors: true,
				verbose: true
			})
			.run(function (err) {
				if (err) {
					done(err);
				}

				nexpect.spawn("git", ["commit", "-am", "."], {
					stripColors: true
				})
				.wait(".editorconfig")
				.expect(".gitignore")
				.expect(".gitmodules")
				.expect(".robyn")
				.expect("README.md")
				.expect("grunt.js")
				.expect("package.json")
				.expect("robyn.json")
				.run(done);
			});
		});

		it("Should clone the repository", function (done) {
			nexpect.spawn("git", ["clone", "--local", test, clone], {
				stripColors: true,
				verbose: true
			})

			.expect("Cloning into 'clone'")
			.wait("done.")

			.run(done);
		});

		it("Should warn about initialization", function (done) {
			nexpect.spawn("grunt", [], {
				stripColors: true
			})

			.expect("<WARN> .robyn is not yet initialized")
			.expect("Run `git submodule update --init` to enable")
			.expect("Then try this command again. Use --force to continue. </WARN>")

			.expect("Aborted due to warnings.")

			.run(done);
		});

		it("Should initialize the robyn submodule", function (done) {
			nexpect.spawn("git", ["submodule", "update", "--init"], {
				stripColors: true
			})

			.expect("Submodule '.robyn' (git://github.com/ff0000/robyn.git) registered for path '.robyn'")
			.expect("Cloning into '.robyn'")
			.expect("remote: Counting objects:").wait("done.")
			.expect("remote: Compressing objects:").wait("done.")
			.expect("remote: Total")
			.expect("Receiving objects:").wait("done.")
			.expect("Resolving deltas:").wait("done.")
			.expect("Submodule path '.robyn': checked out")

			.run(done);
		});

		it("Should run the default grunt task", function (done) {
			grunt.spawn("", [], {
				stripColor: true
			})

			.expect('Running "default" task')
			.expect('Running "start" task')

			.expect('[*] Starting the party')
			.expect('    Installing npm modules').wait('OK')

			.expect("[*] This party's already been started. You can install individual plugins with `grunt install`")

			.expect('Running "info" task')

			.expect('[*] Project name: robynTest')
			.expect('    Project version: 0.1.0')
			.expect('    Project author: RED Interactive <geeks@ff0000.com>')
			.expect('    Project repository: _PROJECT_REPOSITORY_')

			.expect('[*] robyn version: 3.0.0')
			.expect('    via git://github.com/ff0000/robyn.git @ branch')

			.expect('Done, without errors.')
			.run(function (err) {
				var wrench = require("wrench");
				wrench.rmdirSyncRecursive(clone);

				done(err);
			});
		});
	});
});

describe("Default Tasks", function () {

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
			.wait("[*] robyn version: 3.0.0")
			.expect("via " + repositoryUrl)
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
