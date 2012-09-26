/*global module:false*/
module.exports = function (grunt) {

	var pkg = require("../utils/pkg");
	var fs = require("fs");

	grunt.registerHelper("is_okay", function (file, include, exclude) {
		var ok = false;
		var re;

		for (var i = 0; i < include.length; i ++) {
			re = include[i];
			if (re.test(file)) {
				ok = true;
				break;
			}
		}
		for (i = 0; i < exclude.length; i ++) {
			re = exclude[i];
			if (re.test(file)) {
				ok = false;
				break;
			}
		}
		return ok;
	});

	grunt.registerHelper("replace_vars", function (str) {
		for (var p in pkg.config.vars) {
			var re = new RegExp("([\\t,\\s]*)({?#?__" + p + "__#?}?)", "g");
			var re2 = new RegExp("([\\t,\\s]*)({#__" + p + "__#})([\\s\\S]*)({#\\/__" + p + "__#})", "g");

			if (re.test(str)) {
				var prefixRE = /([\t,\s]*)(?=[{#]*__" + p + "__[#}]*)/g;
				var prefixMatch = str.match(prefixRE);

				var prefix = prefixMatch ? prefixMatch[0] : "";

				var repl = pkg.config.vars[p].split("\n").join("\n" + prefix);

				if (!re2.test(str)) {
					str = str.replace(re, "$1" + repl, "g");
				} else {
					str = str.replace(re2, "$1$2\n$1" + repl + "\n$1$4");
				}
			}
		}

		return str;
	});

	grunt.registerHelper("replace_in_files", function (cb) {
		var path = require("path");
		var updatePath = path.join(__dirname, "../utils/local-pkg");

		delete require.cache[updatePath + ".js"];

		var localPkg = require("../utils/local-pkg");
		var files = grunt.file.expand("**/*");

		var i, j, current, newFile,
			stats;

		var excludeDirs = localPkg.config.excludePaths || [];

		var excludeFiles = excludeDirs.concat(excludeDirs.map(function (dir) {
			return dir + "/**/*";
		})).concat([
			"**/*.{fla,gz,tar,tgz,zip,pyc,DS_Store,bpm,ico,psd,swf,gif,png,jpg}",
			"**/*.{ttf,otf,eot,woff,jar,exe,pdf,bz2,swc,as,mp3}",
			"**/*.min.{js,css}"
		]);

		for (i = 0, j = files.length; i < j; i++) {
			current = files[i];

			if (!grunt.file.isMatch(excludeFiles, current) && fs.statSync(current).isFile()) {

				var contents = grunt.file.read(current, "utf-8");
				contents = grunt.helper("replace_vars", contents.toString());
				grunt.file.write(current, contents);
			}
		}

		for (i = 0, j = files.length; i < j; i++) {
			current = files[i];

			if (!grunt.file.isMatch(excludeFiles, current)) {
				newFile = grunt.helper("replace_vars", current.toString());

				if (current !== newFile && fs.existsSync(current) && fs.statSync(current).isDirectory()) {
					var wrench = require("wrench");
					wrench.copyDirSyncRecursive(current, newFile);
					wrench.rmdirSyncRecursive(current, true);
				}
			}
		}

		if (cb) {
			cb();
		}

		return;
	});

};
