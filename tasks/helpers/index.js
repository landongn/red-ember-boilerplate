/* jshint node:true */
"use strict";

module.exports = {
	init : function (grunt) {
		var fs = require("fs");
		var path = require("path");
		var basename = path.basename(__filename);
		var files = fs.readdirSync(__dirname).filter(function (file) {
			return file !== basename;
		});

		var helpers = {};

		var loadHelpers = function (files) {
			var i, j, file;

			for (i = 0, j = files.length; i < j; i++) {
				file = files[i];
				helpers[path.basename(file, ".js")] = require(path.join(__dirname, file))(grunt);
			}
		};

		var loadPlugins = function () {
			var pkg = require("../utils/pkg"),
				cwd = process.cwd();

			var pristinePkg = require(path.join(cwd, pkg.config.dirs.robyn, "package.json")),
				plugins = pkg.installedPlugins,
				key, pluginDir, plugDir, helperDir;

			for (key in plugins) {
				pluginDir = path.join(cwd, pkg.config.dirs.robyn, pristinePkg.config.dirs.plugins);
				helperDir = path.join(pluginDir, key, "tasks", "helpers");

				if (fs.existsSync(helperDir)) {
					loadHelpers(fs.readdirSync(helperDir));
				}
			}
		};

		loadHelpers(files);
		loadPlugins();

		return helpers;
	}
};
