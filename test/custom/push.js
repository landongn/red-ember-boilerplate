/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Push Task", function () {

	it("grunt push", function (done) {
		grunt.spawn("push")
		.expect('Running "push" task')
		.wait('Running "push:apply')
		.wait('Done, without errors.')
		.run(done);
	});

});
