/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	grunt.registerMultiTask("copy", "Copy source files to static dir.", function () {
		this.requiresConfig("copy");

		var fs = require("fs");
		var path = require("path");
		var cwd = process.cwd() + path.sep;

		var isWatch = !!soft;
		var isBuild = !isWatch;

		var data = this.data;

		var filterFiles = function (src, regExp) {
			return function (file) {
				var relative = file.replace(src + path.sep, "");
				return !(regExp).test(relative);
			};
		};

		for (var i = 0, j = data.length; i < j; i++) {
			var src = data[i].src;
			var dest = data[i].dest;
			var ignoreDirs = data[i].ignoreDirs || [];

			var wildcard = src;

			if (fs.existsSync(src) && fs.statSync(src).isDirectory() && src.indexOf("*") === -1) {
				wildcard = path.join(src, "**", "*");
			}

			var files = grunt.file.expandFiles(wildcard);
			var k, l;

			for (k = 0, l = ignoreDirs.length; k < l; k++) {
				var dir = ignoreDirs[k];

				var regExp = new RegExp("^" + (dir.dir || dir));

				if (typeof dir.dir !== "undefined") {
					// Object
					if ((isWatch && dir.ignoreOnWatch === true) || (isBuild && dir.ignoreOnBuild === true)) {
						files = files.filter(filterFiles(src, regExp));
					}
				} else if (typeof dir !== "undefined") {
					// String or RegExp
					files = files.filter(filterFiles(src, regExp));
				}
			}

			for (k = 0, l = files.length; k < l; k++) {
				var file = files[k];

				if (fs.existsSync(file)) {
					var stats = fs.statSync(file);

					if (isWatch && new Date(stats.ctime).getTime() < timestamp) {
						continue;
					}

					if (!grunt.option("quiet")) {
						console.log("Copy ".green + file.replace(src, dest).grey);
					}

					grunt.file.copy(file, file.replace(src, dest));
				}
			}
		}
	});

};
