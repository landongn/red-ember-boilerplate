/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	// Default task.
	grunt.registerTask("default", function () {
		var done = this.async();
		var tasks = ["tasks"];

		grunt.helper("check_initialized", function (initialized) {
			if (!initialized) {
				tasks.unshift("start");
			}

			grunt.task.run(tasks);
			done();
		}.bind(this));
	});

};
