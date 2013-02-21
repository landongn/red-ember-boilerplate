/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		caboose = require(path.join(__dirname, "../plugin.json")),
		source = path.join(caboose.config.scope, "img"),
		output = path.join("project/static/img");

	grunt.config.set("img", {
		dev : {
			src: path.join(output, "**", "*.{png,jpeg,jpg}")
		},

		prod: {
			src: path.join(output, "**", "*.{png,jpeg,jpg}")
		}
	});

	grunt.registerTask("img:prebuild", function () {
		var done = this.async();
		var wrench = require("wrench");

		if (!fs.existsSync(output)) {
			wrench.mkdirSyncRecursive(output);
		}

		// Replace old files
		var topLevelDirs = grunt.file.expand(path.join(source, "*")).filter(function (dir) {
			return dir.indexOf("sprites") === -1;
		});

		for (var i = 0, j = topLevelDirs.length; i < j; i++) {
			var dir = topLevelDirs[i];

			if (!fs.existsSync(dir)) {
				continue;
			}

			var stats = fs.statSync(dir);
			var newPath = dir.replace(source, output);

			if (stats.isFile()) {
				grunt.file.copy(dir, newPath);
			} else {
				wrench.copyDirSyncRecursive(dir, newPath);
			}
		}

		done();
	});

	grunt.config.set("watch.img", {
		files : [path.join(source, "**/*.{gif,png,jpeg,jpg}")],
		tasks : ["img:prebuild"]
	});

	grunt.config.set("build.img", ["img:prebuild", "img:prod"]);

	// Load task
	grunt.loadNpmTasks("grunt-img");
};
