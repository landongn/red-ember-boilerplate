/*jslint node: true */
var fs = require("fs"),
	path = require("path");

var pkgFile = path.join(process.cwd(), "robyn.json");
var pkg = JSON.parse(fs.readFileSync(pkgFile, "utf-8"));

pkg.save = function () {
	"use strict";

	var obj = {};
	for (var prop in this) {
		if (prop !== "save") {
			obj[prop] = this[prop];
		}
	}

	fs.writeFileSync(pkgFile, JSON.stringify(obj, null, "\t") + "\n");
};

module.exports = pkg;
