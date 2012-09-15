/*global module:false*/
module.exports = function (grunt) {

	grunt.registerMultiTask("build", "Build your project.", function () {
		var done = this.async();
		this.requiresConfig("build");

		grunt.helper("check_initialized", function (initialized) {
			var tasks = [];

			if (!initialized) {
				tasks.push("start");
			}

			tasks.push(this.data);
			grunt.task.run(tasks);

			done();
		}.bind(this));

	});

};
