/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Tasks Task", function () {

	it("grunt tasks", function (done) {
		grunt.spawn("tasks")

		.expect('Running "tasks" task')
		.wait('build')
		.wait('watch')
		.wait('Done, without errors.')

		.run(done);
	});

});
