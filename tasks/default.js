/*global module:false*/

module.exports = function (grunt) {

	var pkg = require("./utils/pkg");

	// Default task.
	grunt.registerTask("default", ["start", "tasks"]);

};
