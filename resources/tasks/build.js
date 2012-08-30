/*global module:false*/
module.exports = function (grunt) {

	grunt.registerMultiTask("build", "Build your project.", function () {
		grunt.helper("check_initialized", function (initialized) {
			if (!initialized) {
				return false;
			}
		});

		this.requiresConfig("build");
		grunt.task.run(this.data);
	});

	grunt.config.set("build.start", "start");

};
