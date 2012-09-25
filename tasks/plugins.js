/*global module:false*/

module.exports = function (grunt) {

	var pkg = require("./utils/pkg"),
		path = require("path"),
		fs = require("fs");

	var plugins = pkg.config.installedPlugins,
		i, j, plugDir, helperDir;

	for (i = 0, j = plugins.length; i < j; i++) {
		plugDir = pkg.config.dirs.robin + "/components/" + plugins[i] + "resources/tasks";
		helperDir = plugDir + "/helpers";

		if (fs.existsSync(plugDir)) {
			grunt.loadTasks(plugDir);

			if (fs.existsSync(helperDir)) {
				grunt.loadTasks(helperDir);
			}
		}
	}

};
