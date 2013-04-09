/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerMultiTask("build", "Build your project.", function () {
		var done = this.async();
		this.requiresConfig("build");

		grunt.helper("check_initialized", function (initialized) {
			var tasks = [];

			if (!grunt.config.get("synced")) {
				tasks.push("sync");
			}

			if (!initialized) {
				tasks.unshift("start");
			}

			if (typeof this.data === typeof []) {
				tasks = tasks.concat(this.data);
			} else {
				tasks.push(this.data);
			}

			grunt.task.run(tasks);

			done();
		}.bind(this));

	});

};
