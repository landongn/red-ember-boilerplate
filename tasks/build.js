/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("build", "Build your project.", function () {
		var helper = require("./helpers").init(grunt);

		var done = this.async();
		this.requiresConfig("build");
		grunt.loadNpmTasks("grunt-concurrent");

		var builds = grunt.config("build");

		grunt.config.set("concurrent", {
			"pre": grunt.config.get("concurrent.pre") || [],
			"build": grunt.config.get("concurrent.build") || [],
			"post": grunt.config.get("concurrent.post") || []
		});

		for (var name in builds) {
			var tasks = builds[name];

			if (Object.prototype.toString.call(tasks) !== "[object Object]") {
				grunt.config.set("concurrent.build", grunt.config.get("concurrent.build").concat(tasks));
			} else {
				for (var key in tasks) {
					var phase = grunt.config.get("concurrent." + key);

					if (typeof phase !== "undefined") {
						grunt.config.set("concurrent." + key, phase.concat(tasks[key]));
					} else {
						grunt.config.set("concurrent.build", grunt.config.get("concurrent.build").concat(tasks[key]));
					}
				}
			}
		}

		helper.checkInitialized(function (initialized) {
			var tasks = [];

			if (!grunt.config.get("synced")) {
				grunt.config.set("concurrent.pre", ["sync"].concat(grunt.config.get("concurrent.pre")));
			}

			if (!initialized) {
				tasks.unshift("start");
			}

			tasks.push("concurrent");

			grunt.task.run(tasks);

			done();
		}.bind(this));

	});

};
