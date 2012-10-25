/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var fs = require("fs");
var path = require("path");
var cwd = process.cwd();
var expect = require("expect.js");
var test = path.join(cwd, "build");

describe("Additional files", function () {
	var files = [
		".gitattributes",
		"project"
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
