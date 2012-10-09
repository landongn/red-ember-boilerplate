/*jshint node:true*/
module.exports = (function () {
	"use strict";

	var pkg = require("./pkg");
	var localPkg = require("./local-pkg");

	var fs = require("fs");
	var path = require("path");

	function rename(obj, origVal, newVal) {
		pkg.config[newVal] = {};

		for (var key in pkg.config[origVal]) {
			pkg.config[newVal][key] = pkg.config[origVal][key];
		}

		delete pkg.config[origVal];
	}

	return {
		versions : {},

		run : function (cb) {
			var versions = this.versions,
				version;

			for (version in versions) {
				versions[version]();
			}

			pkg.save();
			localPkg.save();

			if (cb) {
				cb();
			}
		}
	};
}());
