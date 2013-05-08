/*jslint node: true */
"use strict";

module.exports = function (grunt, helper, cb) {
	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		pkg = require(path.join(cwd, "robyn.json")),
		configPath = path.join(cwd, pkg.config.dirs.config, "tmux");

	var installTmuxinator = function () {
		helper.spawn({
			cmd: "bundle",
			args: ["install", "--path", ".bundle"],
			title: "Installing tmuxinator",
			complete: function (code) {
				if (code !== 0) {
					return exit("No executable named bundle found.");
				}

				return exit();
			}
		});
	};

	var writeToGemfile = function () {
		var gemfile = path.join(cwd, "Gemfile");

		if (!fs.existsSync(gemfile)) {
			return exit("No Gemfile found.");
		}

		var tmuxinator = 'gem "tmuxinator", "0.5.0"';
		grunt.file.write(grunt.file.read(gemfile) + "\n" + tmuxinator + "\n");

		installTmuxinator();
	};

	var copyTmuxConfig = function () {
		var wrench = require("wrench");
		var userTmuxinatorDir = path.join(process.env.HOME, ".tmuxinator");

		if (!fs.existsSync(userTmuxinatorDir)) {
			wrench.mkdirSyncRecursive(userTmuxinatorDir);
		}

		var tmuxinatorFile = path.join(configPath, grunt.template.process("<%= meta.projectName %>") + ".yml");
		var userTmuxinatorFile = path.join(userTmuxinatorDir, path.basename(tmuxinatorFile));

		if (fs.existsSync(userTmuxinatorFile)) {
			return exit(userTmuxinatorFile + " already exists. Aborting.");
		}

		var contents = grunt.file.read(tmuxinatorFile);
		contents = contents.replace("__" + "PROJECT_ROOT" + "__", cwd);

		grunt.file.write(tmuxinatorFile, contents);
		fs.symlinkSync(tmuxinatorFile, userTmuxinatorFile);

		writeToGemfile();
	};

	var exit = function (error) {
		if (cb) {
			cb(error);
		} else {
			process.exit();
		}
	};

	copyTmuxConfig();

};
