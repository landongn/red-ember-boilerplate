/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Build Task", function () {

	it("grunt build", function (done) {
		grunt.spawn("build")
		.wait('Done, without errors.')
		.run(done);
	});

});
