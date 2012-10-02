/*global module:false*/
module.exports = function (grunt) {

	grunt.registerHelper("get_assertion", function (value) {
		return (value === "Y/n" || value.toLowerCase() === "y") ? true : false;
	});

};
