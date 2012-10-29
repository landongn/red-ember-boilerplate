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
			var semver = require("semver");
			expect(semver.valid(robynPkg.version)).to.be.ok();
		});

		it("should point to a valid repository", function () {
			expect(robynPkg.repository).to.be.an("object");
			expect(robynPkg.repository.type).to.equal("git");

			if (fs.existsSync(robynPkg.repository.url)) {
				expect(fs.existsSync(robynPkg.repository.url)).to.be.ok();
			} else {
				expect(robynPkg.repository.url).to.match(/(^((git@)|(http(s)|git):\/\/)(.*)\.git$)|(^$)/);
			}
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
});

describe("Clone Check", function () {
	var clone = path.join(cwd, "clone");

	before(function (done) {
		if (fs.existsSync(clone)) {
			var wrench = require("wrench");
			wrench.rmdirSyncRecursive(clone);
		}

		nexpect.spawn("git", ["add", "--all"], {
			cwd: test,
			stripColors: true
		})
		.run(function () {
			nexpect.spawn("git", ["commit", "-am", "."], {
				cwd: test,
				stripColors: true
			})
			.run(done);
		});
	});

	it("Should clone the repository", function (done) {
		nexpect.spawn("git", ["clone", "--local", test, clone], {
			stripColors: true
		})

		.expect("Cloning into")
		.wait("done.")

		.run(done);
	});

	it("Should initialize the robyn submodule", function (done) {
		nexpect.spawn("git", ["submodule", "update", "--init"], {
			cwd: clone,
			stripColors: true
		})

		.expect("registered for path '.robyn'")
		.run(done);
	});

	it("Should run the default grunt task", function (done) {
		grunt.spawn("", {
			cwd: clone
		})

		.wait('Running "default" task')
		.expect('Running "start" task')

		.expect('[*] Starting the party')
		.expect('Installing npm modules').wait('OK')

		.expect('Installing bundle. This may take a minute').wait('OK')
		.expect('Looks like RED Start was already run on this project. Skipping ahead...')
		.expect('Creating a virtualenv. This may take a minute').wait('OK')

		.wait("[*] This party's already been started. You can install individual plugins with `grunt install`")

		.expect('Running "tasks" task')
		.wait('Done, without errors.')
		.run(function (err) {
			var wrench = require("wrench");
			wrench.rmdirSyncRecursive(clone);

			done(err);
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
			.wait("Running \"default\" task")
			.expect("Running \"tasks\" task")
			.run(done);
		});
	});

	describe("info", function () {
		it("grunt info", function (done) {
			grunt.spawn("info")
			.wait("[*] robyn version:")
			.expect("via ")
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
			.wait("Checking for newer version")
			.expect(".")
			.wait("OK")
			.expect("Done, without errors.")
			.run(done);
		});
	});
});
