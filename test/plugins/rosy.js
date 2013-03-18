/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Rosy Tasks", function () {

	describe("JSHint", function () {
		it("grunt jshint", function (done) {
			grunt.spawn("jshint")

			.expect('Running "jshint" task')
			.wait('Done, without errors')

			.run(done);
		});
	});

	describe("RequireJS", function () {
		it("grunt requirejs", function (done) {
			grunt.spawn("requirejs")

			.wait('Done, without errors.')

			.run(done);
		});
	});

});
