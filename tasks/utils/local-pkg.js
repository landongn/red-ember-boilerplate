/*jslint node: true */

var fs = require("fs");
var pkg = require("./pkg");
var cwd = process.cwd();
var path = require("path");

var configDir = path.join(cwd, pkg.config.dirs.config);

var localPkg = path.join(configDir, "robyn-local.json");
var defaultLocalPkg = path.join(__dirname, "../../config/local-default.json");

var pkgFile = localPkg;

if (!fs.existsSync(pkgFile)) {

	if (!fs.existsSync(configDir)) {
		var dirs = configDir.replace(cwd + "/", "").split(path.sep),
			curr = cwd;

		while (dirs.length) {
			curr = path.join(curr, dirs.shift());

			if (!fs.existsSync(curr)) {
				fs.mkdirSync(curr);
			}
		}
	}

	pkgFile = defaultLocalPkg;

	if (!fs.existsSync(pkgFile)) {
		console.error("File not found: %f".replace("%f", pkgFile));
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

	fs.writeFileSync(localPkg, JSON.stringify(obj, null, "\t") + "\n");
};

module.exports = pkg;
