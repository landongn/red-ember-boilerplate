/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Statix Tasks", function () {

	it("grunt statix:build", function (done) {
		grunt.spawn("statix:build")

		.wait('Running "statix:build" task')
		.wait('Running "build:compass" (build) task')
		.wait('Running "build:modernizr" (build) task')
		.wait('Running "build:jshint" (build) task')
		.wait('Running "build:requirejs" (build) task')
		.wait('Done, without errors.')
		.expect('Statix build complete!')
		.expect('Done, without errors.')

		.run(done);
	});

});
