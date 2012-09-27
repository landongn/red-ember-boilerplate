module.exports = function (grunt) {

	var fs = require("fs"),
		path = require("path"),
		jshint = require("jshint").JSHINT,
		jshintOptions = require(".jshintrc");

	var FILES = path.join("project", "static", "js", "**/*[^.min].js");

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

	grunt.registerTask("jshint", "JSHint your JavaScript.", function (mode) {

		var done = this.async();

		if (mode === "browser") {
			jshintOptions.node = false;
			jshintOptions.devel = false;
			jshintOptions.browser = true;
		}

		var hasErrors = false;

		var exclude = grunt.file.read(".jshintignore").split("\n");
		var files = grunt.file.expandFiles(FILES).filter(function (file) {
			return !grunt.file.isMatch(exclude, file);
		});

		for (var i = 0; i < files.length; i ++) {
			var file = files[i];
			var fa = file.split("/");
			fa[fa.length - 1] = fa[fa.length - 1].white;
			var filename = fa.join("/").grey;

			var contents = fs.readFileSync(file, "utf-8");

			if (!jshint(contents, jshintOptions)) {
				hasErrors = true;

				grunt.log.writeln();
				grunt.log.writeln(pad("", 4) + "Err ".red + filename);

				for (var j = 0; j < jshint.errors.length; j ++) {
					var err = jshint.errors[j],
						line = ["line", pad(err.line, 3, " "), ": char", pad(err.character, 3, " "), pad("", 2)].join(" ").grey.bold,
						reason = err.reason.yellow;

					grunt.log.writeln(pad("", 8) + line + reason);
					grunt.log.writeln(pad("", 30) + trim(err.evidence).white);
					grunt.log.writeln();
				}
			}

			else {
				grunt.log.writeln(pad("", 4) + "Ok  ".green + filename);
			}
		}

		done(!hasErrors);
	});

	grunt.config.set("watch.jshint", {
		files: FILES,
		tasks: ["jshint"]
	});

	grunt.config.set("build.jshint", "jshint:browser");
};
