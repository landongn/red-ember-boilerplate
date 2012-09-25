/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		meta: {
			projectName: "__PROJECT_NAME__",
			projectTitle: "__PROJECT_TITLE__"
		}
	});

	grunt.loadTasks(".robin/robin/resources/tasks");
	grunt.loadTasks(".robin/robin/resources/tasks/helpers");

};
