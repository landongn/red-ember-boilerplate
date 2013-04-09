/*jslint node: true */
module.exports = (function () {
	"use strict";

	var config = require("../../plugin.json").config;
	var cwd = process.cwd();
	var path = require("path");
	var fs = require("fs");

	var adminPath = "";
	for (var i = 0; i < config.adminPath.length; i++) {
		adminPath = path.join(adminPath, config.adminPath[i]);
	}

	var exports = {
		cwd: cwd
	};

	exports.sourcePathRel = path.join(adminPath, "source");
	exports.staticPathRel = path.join(adminPath, "static", "scarlet");

	exports.sourcePath = path.join(cwd, exports.sourcePathRel);
	exports.staticPath = path.join(cwd, exports.staticPathRel);

	exports.baseSource = path.join(cwd, "project", "source");
	exports.baseJSSource = path.join(exports.baseSource, "js");

	if (!fs.existsSync(exports.baseSource)) {
		exports.baseSource = path.join(cwd, "resources");
		exports.baseJSSource = path.join(cwd, "project", "static", "js");
	}

	return exports;
}());
