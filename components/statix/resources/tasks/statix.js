module.exports = function(grunt) {

	var cp = require("child_process");

	var exec = function (exec, args, cwd, doneCB) {
		
		var child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			stdio: "inherit"
		});

		child.addListener("exit", function (code) {
			doneCB(!code);
		});
	};

	grunt.registerTask("statix:build", "Build with statix", function() {
		var done = this.async();
		exec("statix", ["build"], "./resources/config/statix/", function (success) {
			done(1);
		});
	});

	grunt.registerTask("statix:server", "Run the statix server", function(p) {
		port = p || 8000;
		var done = this.async();
		exec("statix", ["server", "-p", port, "-d", "../../../project"], "./resources/config/statix/", function (success) {
			done(1);
			process.exit();
		});
	});

};