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
		var hasMatch;

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

				hasMatch = true;
			}
		}

		if (!hasMatch) {
			return false;
		}

		return str;
	});

	grunt.registerHelper("replace_in_files", function (cb, opts) {
		var path = require("path");
		var updatePath = path.join(__dirname, "../utils/local-pkg");

		opts = opts || {};
		var root = opts.root || "";
		var config = opts.config || {};

		delete require.cache[updatePath + ".js"];

		var files = grunt.file.expand(config, path.join(root, "**/*"));

		var i, j, current, newFile,
			stats;

		var excludeDirs = (pkg.config.excludedPaths || []).filter(function (path) {
			return !opts.root || path.indexOf(root) !== -1;
		});

		var excludeFiles = excludeDirs.concat(excludeDirs.map(function (dir) {
			return dir + "/**/*";
		})).concat([
			"**/*.{fla,gz,tar,tgz,zip,pyc,DS_Store,bpm,ico,psd,swf,gif,png,jpg}",
			"**/*.{ttf,otf,eot,woff,jar,exe,pdf,bz2,swc,as,mp3}",
			"**/*.min.{js,css}"
		]);

		files.filter(function (file) {
			return !grunt.file.isMatch(excludeFiles, file) && fs.statSync(file).isFile();
		}).forEach(function (file) {
			var contents = fs.readFileSync(file, "utf8");
			contents = grunt.helper("replace_vars", contents.toString());

			if (contents) {
				grunt.file.write(file, contents);
			}
		});

		files.filter(function (file) {
			return !grunt.file.isMatch(excludeFiles, file) && fs.statSync(file).isDirectory();
		}).forEach(function (file) {
			if (fs.existsSync(file)) {
				newFile = grunt.helper("replace_vars", file.toString());

				if (newFile && file !== newFile) {
					var wrench = require("wrench");
					wrench.copyDirSyncRecursive(file, newFile);
					wrench.rmdirSyncRecursive(file, true);
				}
			}
		});

		if (cb) {
			cb();
		}

		return;
	});

};
