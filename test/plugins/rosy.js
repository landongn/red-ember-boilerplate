/* jshint node: true */
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

	describe("Modernizr", function () {
		it("grunt modernizr", function (done) {
			var asyncFileDetect = /(cache|200) modernizr(-latest|\.load\.1\.5\.4).js/;

			grunt.spawn("modernizr")

			.expect('Running "modernizr" task')

			.expect('Enabled Extras')
			.expect('>> shiv')
			.expect('>> load')
			.expect('>> cssclasses')

			.expect('Looking for Modernizr references')

			.wait('Downloading source files')
			.expect(asyncFileDetect)
			.expect(asyncFileDetect)

			.expect('>> Generating a custom Modernizr build')
			.expect('>> Uglifying')

			.expect('>> Wrote file to project/static/js/libs/modernizr/modernizr.min.js')

			.expect('Done, without errors.')

			.run(done);
		});
	});

});
