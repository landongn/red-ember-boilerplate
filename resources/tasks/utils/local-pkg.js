/*jslint node: true */
/*global jake, desc, task */
var fs = require("fs");
var path = require("path");

var pkgFile = path.join(__dirname, "../../config/local.json");

if (!fs.existsSync(pkgFile)) {
	var defaultPkgFile = pkgFile.replace(".json", "-default.json");

	if (fs.existsSync(defaultPkgFile)) {
		fs.renameSync(defaultPkgFile, pkgFile);
	} else {
		console.error("File not found: %f".replace("%f", defaultPkgFile));
		process.exit();
	}
}

var pkg = JSON.parse(fs.readFileSync(pkgFile, "utf-8"));

pkg.save = function () {
	"use strict";

	var obj = {};
	for (var prop in this) {
		if (prop !== "save") {
			obj[prop] = this[prop];
		}
	}

	fs.writeFileSync(pkgFile, JSON.stringify(obj, null, "\t"));
};

module.exports = pkg;
