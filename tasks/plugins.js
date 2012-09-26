/*global module:false*/

module.exports = function (grunt) {

	var pkg = require("./utils/pkg"),
		path = require("path"),
		fs = require("fs");

	var plugins = pkg.config.installedPlugins,
		key, plugDir, helperDir;

	for (key in plugins) {
		plugDir = pkg.config.dirs.robin + "/components/" + key + "/resources/tasks";
		helperDir = plugDir + "/helpers";

		if (fs.existsSync(plugDir)) {
			grunt.loadTasks(plugDir);

			if (fs.existsSync(helperDir)) {
				grunt.loadTasks(helperDir);
			}
		}
	}

};
