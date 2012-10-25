/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Caboose Tasks", function () {

	describe("Compass", function () {
		var asyncFileDetect = /overwrite project\/static\/css\/(style|ie)\.css/;

		it("grunt compass:dev", function (done) {
			grunt.spawn("compass:dev")

			.expect('Running "compass:dev" (compass) task')
			.expect(asyncFileDetect)
			.expect(asyncFileDetect)

			.expect('Done, without errors.')

			.run(done);
		});

		it("grunt compass:prod", function (done) {
			grunt.spawn("compass:prod")

			.expect('Running "compass:prod" (compass) task')
			.expect(asyncFileDetect)
			.expect(asyncFileDetect)

			.expect('Done, without errors.')

			.run(done);
		});
	});

});
