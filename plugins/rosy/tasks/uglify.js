/* jshint node: true */
"use strict";

module.exports = function (grunt) {

	grunt.registerTask("requirejs:uglify", function () {
		var done = this.async();
		var uglify = require("uglify-js");
		var colors = require("colors");

		var fs = require("fs");
		var cwd = process.cwd();
		var path = require("path");

		var requirePath = path.join(cwd, "project", "source", "js", "libs", "require.js");

		if (fs.existsSync(requirePath)) {
			var result = uglify.minify(requirePath, {
				outSourceMap: "require.js.map"
			});

			var staticPath = requirePath.replace("source", "static");

			grunt.log.writeln();
			grunt.log.writeln(("Minified RequireJS to " + staticPath.replace(path.join(cwd, path.sep), "")).grey);
			grunt.file.write(staticPath, result.code);

			var mapPath = staticPath.replace("require.js", "require.js.map");

			grunt.log.writeln(("Saved source map to " + mapPath.replace(path.join(cwd, path.sep), "")).grey);
			grunt.file.write(mapPath, result.map);
		}

		done();
	});

};
