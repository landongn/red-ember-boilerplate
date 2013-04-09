module.exports = function (grunt) {
	"use strict";

	var path = require("path");

	var dev = [{
		src: "project/source/local",
		dest: "project/static/local"
	}, {
		src: "project/source/fonts",
		dest: "project/static/fonts"
	}, {
		src: "project/source/js",
		dest: "project/static/js"
	}, {
		src: "project/source/img",
		dest: "project/static/img"
	}];

	// By default, dev / prod are the same
	// Feel free to customize to your needs

	if (grunt.config.get("copy")) {
		grunt.config.set("copy.dev", dev);
		grunt.config.set("copy.prod", dev);
	} else {
		grunt.config.set("copy", {
			dev: dev,
			prod: dev
		});
	}

	grunt.config.set("watch.copy", {
		files : grunt.config.get("copy").dev.map(function (obj) {
			return path.join(obj.src, "**", "*");
		}),
		tasks : ["copy:dev:soft"]
	});

	grunt.config.set("build.copy", ["copy:prod"]);
};
