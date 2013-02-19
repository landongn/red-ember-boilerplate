/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Push Task", function () {

	it("grunt push", function (done) {
		grunt.spawn("push")
		.wait('Running "push" task')
		.wait("Aborted due to warnings.")
		.run(done);
	});

});
