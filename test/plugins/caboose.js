/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Caboose Tasks", function () {

	describe("Compass", function () {
		it("grunt compass:dev", function (done) {
			grunt.spawn("compass:dev")

			.expect('Running "compass:dev" (compass) task')
			.expect('overwrite project/static/css/ie.css')
			.expect('overwrite project/static/css/style.css')

			.run(done);
		});

		it("grunt compass:prod", function (done) {
			grunt.spawn("compass:prod")

			.expect('Running "compass:prod" (compass) task')
			.expect('overwrite project/static/css/ie.css')
			.expect('overwrite project/static/css/style.css')

			.run(done);
		});
	});

});
