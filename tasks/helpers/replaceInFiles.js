/* jshint node:true */
module.exports = function (grunt) {

	var replaceInFiles = function (cb, opts) {
		var helper = require("../helpers").init(grunt);

		var pkg = require("../utils/pkg");
		var fs = require("fs");

		var path = require("path");
		var updatePath = path.join(__dirname, "../utils/local-pkg");

		opts = opts || {};
		var root = opts.root || "";
		var config = opts.config || {};

		delete require.cache[updatePath + ".js"];

		var i, j, current, newFile,
			stats;

		var excludeDirs = (pkg.config.excludedPaths || []).filter(function (path) {
			return !opts.root || path.indexOf(root) !== -1;
		});

		var excludeFiles = excludeDirs.concat(excludeDirs.map(function (dir) {
			return "!" + dir + "/**/*";
		})).concat([
			"!" + root + "**/*.{fla,gz,tar,tgz,zip,pyc,DS_Store,bpm,ico,psd,swf,gif,png,jpg}",
			"!" + root + "**/*.{ttf,otf,eot,woff,jar,exe,pdf,bz2,swc,as,mp3}",
			"!" + root + "**/*.min.{js,css}"
		]);

		var files = grunt.file.expand(config, [path.join(root, "**/*")].concat(excludeFiles));

		console.log(files);

		files.filter(function (file) {
			return fs.statSync(file).isFile();
		}).forEach(function (file) {
			var contents = grunt.file.read(file);
			contents = helper.replaceVars(contents.toString());

			if (contents) {
				grunt.file.write(file, contents);
			}
		});

		files.filter(function (file) {
			return fs.statSync(file).isDirectory();
		}).forEach(function (file) {
			if (fs.existsSync(file)) {
				newFile = helper.replaceVars(file.toString());

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
	};

	return replaceInFiles;

};
