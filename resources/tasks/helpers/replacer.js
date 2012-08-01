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
		var wrench = require("wrench");
		var directories = grunt.file.expandDirs("**/*");

		var i, j, current, newFile;

		var exclude = [
			"{node_modules,.git,.sass-cache}",
			"node_modules/**/*",
			".{git,sass-cache}/**/*",
			"**/*.{fla,gz,tar,tgz,zip,pyc,DS_Store,bpm,ico,psd,swf,gif,png,jpg}",
			"**/*.min.{js,css}"
		];

		for (i = 0, j = directories.length; i < j; i++) {
			current = directories[i];

			if (!grunt.file.isMatch(exclude, current)) {
				newFile = grunt.helper("replace_vars", current.toString());

				if (current !== newFile && fs.existsSync(current)) {
					wrench.copyDirSyncRecursive(current, newFile);
					wrench.rmdirSyncRecursive(current, true);
				}
			}
		}

		var files = grunt.file.expandFiles("**/*");

		for (i = 0, j = files.length; i < j; i++) {
			current = files[i];

			if (!grunt.file.isMatch(exclude, current)) {
				var contents = grunt.file.read(current, "utf-8");
				contents = grunt.helper("replace_vars", contents.toString());
				grunt.file.write(current, contents);
			}
		}

		if (cb) {
			cb();
		}

		return;
	});

};
