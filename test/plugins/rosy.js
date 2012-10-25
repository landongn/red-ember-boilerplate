/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Rosy Tasks", function () {

	describe("JSHint", function () {
		it("grunt jshint", function (done) {
			grunt.spawn("jshint")

			.expect('Running "jshint" task')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Ok  project/static/js')
			.expect('Done, without errors')

			.run(done);
		});
	});

	describe("RequireJS", function () {
		it("grunt requirejs", function (done) {
			grunt.spawn("requirejs")

			.expect('Running "requirejs:desktop" (requirejs) task')

			.expect('Tracing dependencies for: robynTest/Site')
			.expect('Cannot optimize network URL, skipping: //ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js')
			.expect('Uglifying file: project/static/js/site.min.js')

			.expect('Built with the following modules:')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')
			.expect('project/static/js')

			.expect('Done, without errors.')

			.run(done);
		});
	});

});
