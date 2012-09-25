/*jslint node: true */
/*global jake, desc, task */
var fs = require("fs");
var path = require("path");

var localPkg = path.join(__dirname, "../../config/local.json");
var pkgFile = localPkg;

if (!fs.existsSync(pkgFile)) {
	pkgFile = pkgFile.replace(".json", "-default.json");

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
