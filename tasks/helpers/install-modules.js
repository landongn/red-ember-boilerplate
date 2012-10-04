/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("install_modules", function (args, cb) {
		grunt.helper("spawn", {
			cmd: "npm",
			args: ["install"].concat(args),
			title: "Installing npm modules",
			complete: cb
		});
	});

};
