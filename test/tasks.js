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

describe("Default Tasks", function () {

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
