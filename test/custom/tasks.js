/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Tasks Task", function () {

	it("grunt tasks", function (done) {
		grunt.spawn("tasks")

		.expect('Running "tasks" task')

		.expect('build')
		.expect('build:compass')
		.expect('build:modernizr')
		.expect('build:jshint')
		.expect('build:requirejs')
		.expect('bump')
		.expect('compass')
		.expect('compass:dev')
		.expect('compass:prod')
		.expect('compass:bundle')
		.expect('default')
		.expect('info')
		.expect('install')
		.expect('jshint')
		.expect('modernizr')
		.expect('oxblood')
		.expect('requirejs')
		.expect('requirejs:desktop')
		.expect('server')
		.expect('start')
		.expect('statix:build')
		.expect('statix:server')
		.expect('update')
		.expect('watch')
		.expect('watch:modernizr')
		.expect('watch:jshint')
		.expect('watch:requirejs')
		.expect('watch:compass')

		.expect('Done, without errors.')

		.run(done);
	});

});
