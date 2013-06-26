/* jshint node: true */
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Statix Tasks", function () {

	it("grunt statix:build", function (done) {
		grunt.spawn("statix:build")
		.wait('Statix build complete!')

		.run(done);
	});

});
