/*global module:false*/

module.exports = function (grunt) {

	var pkg = require("./utils/pkg"),
		pristinePkg = require(pkg.config.dirs.robin + "/package.json"),
		path = require("path"),
		fs = require("fs");

	var plugins = pkg.config.installedPlugins,
		key, pluginDir, plugDir, helperDir;

	for (key in plugins) {
		pluginDir = path.join(pkg.config.dirs.robin, pristinePkg.config.dirs.plugins);
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
