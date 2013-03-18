/*jslint node: true */
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		rosy = require(path.join(__dirname, "../plugin.json")),
		source = rosy.config.scope,
		jshint = require("jshint").JSHINT;

	var FILES = path.join(source, "**/*[^.min].js");

	function pad(str, len, padChar) {

		str = str.toString();

		if (typeof padChar === "undefined") {
			padChar = " ";
		}

		while (str.length < len) {
			str = padChar + str;
		}
		return str;
	}

	function trim(str) {
		str = str.replace(/^\s\s*/, '');
		var	ws = /\s/,
			i = str.length - 1;

		while (ws.test(str.charAt(i))) {
			i = i - 1;
		}
		return str.slice(0, i + 1);
	}

	var timestamp = new Date().getTime();

	grunt.registerTask("jshint", "JSHint your JavaScript.", function (mode) {

		var done = this.async();
		var jshintOptions = grunt.file.readJSON(path.join(source, ".jshintrc"));

		if (mode === "browser") {
			jshintOptions.node = false;
			jshintOptions.devel = false;
			jshintOptions.browser = true;
		}

		var hasErrors = false;

		var exclude = grunt.file.read(path.join(source, ".jshintignore")).trim().split("\n");
		var files = grunt.file.expandFiles(FILES).filter(function (file) {
			return exclude.every(function (x) {
				x = x.replace(/\./g, "\\.");
				x = x.replace(/^\*/g, ".*");

				var match = (new RegExp(x).test(file));
				return !match;
			});
		});

		for (var i = 0; i < files.length; i ++) {
			var file = files[i];
			var stats = fs.statSync(file);

			var fa = file.split("/");
			fa[fa.length - 1] = fa[fa.length - 1].white;
			var filename = fa.join("/").grey;

			if (mode === "soft" && new Date(stats.ctime).getTime() < timestamp) {
				continue;
			}

			var contents = grunt.file.read(file);

			if (!jshint(contents, jshintOptions)) {
				hasErrors = true;

				grunt.log.writeln();
				grunt.log.writeln("Err ".red + filename);

				for (var j = 0; j < jshint.errors.length; j ++) {
					var err = jshint.errors[j],
						line = ["line", pad(err.line, 1, " "), ": char", pad(err.character, 1, " "), pad("", 1)].join(" ").grey.bold,
						reason = err.reason.yellow;

					grunt.log.writeln(pad("", 4) + line + reason);
					grunt.log.writeln(pad("", 22) + trim(err.evidence).white);
					grunt.log.writeln();
				}
			} else if (!grunt.option("quiet")) {
				grunt.log.writeln("Ok  ".green + filename);
			}
		}

		timestamp = new Date().getTime();
		done(!hasErrors);
	});

	grunt.config.set("watch.jshint", {
		files: FILES,
		tasks: ["jshint:soft"]
	});

	grunt.config.set("build.jshint", "jshint:browser");
};
