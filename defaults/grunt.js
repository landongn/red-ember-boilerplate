/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		meta: {
			projectName: "__PROJECT_NAME__",
			projectTitle: "__PROJECT_TITLE__"
		}
	});

	// Load your custom tasks *after* these
	grunt.loadTasks(".robin/tasks");
	grunt.loadTasks(".robin/tasks/helpers");

	// Customize path in robin.json
	grunt.loadTasks(require("robin.json").dirs.tasks);

};
