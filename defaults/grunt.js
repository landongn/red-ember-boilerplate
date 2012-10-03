/*global module:false*/
module.exports = function (grunt) {
	var path = require("path"),
		cwd = process.cwd();

	// Project configuration.
	grunt.initConfig({
		meta: {
			projectName: "__PROJECT_NAME__",
			projectTitle: "__PROJECT_TITLE__"
		}
	});

	// Robin tasks
	// Load your custom tasks *after* these
	(function () {
		var fs = require("fs");

		var robynDir = ".robyn";
		var taskDir = path.join(cwd, robynDir, "tasks");
		var helperDir = path.join(taskDir, "helpers");

		if (!fs.existsSync(taskDir)) {
			var warn = [
				"%s is not yet initialized".replace("%s", robynDir),
				"Run `git submodule update --init` to enable",
				"Then try this command again."
			].join("\n       ").trim();

			grunt.fail.warn(warn);
		}

		grunt.loadTasks(taskDir);
		grunt.loadTasks(helperDir);
	}());

	// Customize path in robyn.json
	var robynPkg = path.join(cwd, "robyn.json");
	grunt.loadTasks(require(robynPkg).dirs.tasks);

};
