/* jshint node: true */
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Caboose Tasks", function () {

	describe("Caboose", function () {
		var asyncFileDetect = /(?:unchanged project\/source.*)|(?:overwrite project\/static.*)/;

		it("grunt caboose:bundle", function (done) {
			grunt.spawn("caboose:bundle")

			.expect('Running "caboose:bundle" task')
			.expect("The Gemfile's dependencies are satisfied")

			.expect('Done, without errors.')

			.run(done);
		});

		it("grunt caboose:dev", function (done) {
			grunt.spawn("caboose:dev")

			.expect('Running "caboose:dev" (caboose) task')
			.expect(asyncFileDetect)
			.expect(asyncFileDetect)

			.expect('Done, without errors.')

			.run(done);
		});

		it("grunt caboose:prod", function (done) {
			grunt.spawn("caboose:prod")

			.expect('Running "caboose:prod" (caboose) task')
			.wait(asyncFileDetect)
			.expect(asyncFileDetect)

			.expect('Done, without errors.')

			.run(done);
		});
	});

});
