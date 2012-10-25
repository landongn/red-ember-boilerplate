/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerHelper("get_assertion", function (value) {
		return (value === "Y/n" || value.toLowerCase() === "y") ? true : false;
	});

};
