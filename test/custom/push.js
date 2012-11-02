/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Push Task", function () {

	it("grunt push", function (done) {
		grunt.spawn("push")
		.expect('Running "push" task')
		.wait('Running "push:apply')

		.expect("<WARN> fatal: 'origin' does not appear to be a git repository")
		.expect("fatal: Could not read from remote repository.")

		.expect("Please make sure you have the correct access rights")
		.expect("and the repository exists.")
		.expect("Use --force to continue. </WARN>")

		.expect("Aborted due to warnings.")
		.run(done);
	});

});
