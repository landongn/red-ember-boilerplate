/*jshint node:true*/
module.exports = function (grunt) {

	grunt.registerHelper("spawn", function (opts) {
		var cp = require("child_process");
		var isVerbose = grunt.option("verbose");

		var child = cp.spawn(opts.cmd, opts.args, {
			stdio: isVerbose ? "inherit" : "pipe"
		});

		if (!isVerbose) {
			if (opts.title) {
				grunt.helper("write", opts.title.grey);
			}

			grunt.log.write(".".grey);

			child.stdout.on("data", function () {
				grunt.log.write(".".grey);
			});

			if (opts.cmd !== "npm") {
				child.stderr.pipe(process.stderr);
			} else {
				child.stderr.on("data", function () {
					grunt.log.write(".".grey);
				});
			}
		}

		child.on("exit", function (code) {
			if (!isVerbose) {
				grunt.log.write("..".grey);
				grunt.log.ok();
			}

			if (opts.complete) {
				opts.complete(code);
			}
		});
	});

};
