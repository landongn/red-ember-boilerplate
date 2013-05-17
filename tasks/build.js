/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	grunt.registerMultiTask("build", "Build your project.", function () {
		var helper = require("./helpers").init(grunt);

		var done = this.async();
		var build = this.data;

		if (typeof build === "undefined") {
			return done();
		}

		helper.checkInitialized(function (initialized) {
			var tasks = [];

			if (!grunt.config.get("synced")) {
				tasks.push("sync");
			}

			if (!initialized) {
				tasks.unshift("start");
			}

			if (Array.isArray(this.data)) {
				tasks = tasks.concat(this.data);
			} else {
				tasks.push(this.data);
			}

			grunt.task.run(tasks);

			done();
		}.bind(this));

	});

};
