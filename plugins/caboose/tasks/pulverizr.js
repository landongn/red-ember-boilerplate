/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		caboose = require(path.join(__dirname, "../plugin.json")),
		output = "project/static",
		source = caboose.config.scope;

	grunt.config.set("watch.pulverizr", function () {
		var pulverizr = require("pulverizr");
		console.log(pulverizr);
	});
};
