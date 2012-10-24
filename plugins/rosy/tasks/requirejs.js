/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.config.set("requirejs", {
		desktop : {
			options : {
				mainConfigFile : "project/static/js/config.js",
				urlArgs : null,
				include : ["config.js"],
				paths : {
					"jquery": "empty:"
				},
				optimize : "uglify",
				out : "project/static/js/site.min.js",
				name : grunt.task.directive("<config:meta.projectName>") + "/Site",
				skipModuleInsertion : true
			}
		}
	});

	grunt.config.set("watch.requirejs", {
		files: "project/static/js/**/*[^.min].js",
		tasks: ["requirejs"]
	});

	grunt.config.set("build.requirejs", "requirejs");
};
