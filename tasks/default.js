/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	// Default task.
	grunt.registerTask("default", function () {
		var helper = require("./helpers").init(grunt);

		var done = this.async();
		var tasks = ["tasks"];

		helper.checkInitialized(function (initialized) {
			if (!initialized) {
				tasks.unshift("start");
			}

			grunt.task.run(tasks);
			done();
		}.bind(this));
	});

};
