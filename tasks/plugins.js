/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var pkg = require("./utils/pkg"),
		path = require("path"),
		cwd = process.cwd(),
		fs = require("fs");

	var pristinePkg = require(path.join(cwd, pkg.config.dirs.robyn, "package.json")),
		plugins = pkg.installedPlugins,
		key, pluginDir, plugDir, helperDir;

	for (key in plugins) {
		pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
		plugDir = path.join(pluginDir, key, "tasks");
		helperDir = path.join(plugDir, "helpers");

		if (fs.existsSync(plugDir)) {
			grunt.loadTasks(plugDir);

			if (fs.existsSync(helperDir)) {
				grunt.loadTasks(helperDir);
			}
		}
	}

};
