/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var getAssertion = function (value) {
		return (value === "Y/n" || value.toLowerCase() === "y") ? true : false;
	};

	return getAssertion;

};
