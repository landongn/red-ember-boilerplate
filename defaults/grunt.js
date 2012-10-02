/*global module:false*/
module.exports = function (grunt) {

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
		var path = require("path");

		var robynDir = ".robyn";
		var taskDir = path.join(robynDir, "tasks");
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
	grunt.loadTasks(require("robyn.json").dirs.tasks);

};
