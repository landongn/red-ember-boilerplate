/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.config.set("modernizr", {

		// [REQUIRED] Path to the build you're using for development.
		"devFile" : "project/static/js/libs/modernizr.js",

		// [REQUIRED] Path to save out the built file.
		"outputFile" : "project/static/js/libs/modernizr.min.js",

		// Based on default settings on http://modernizr.com/download/
		"extra" : {
			"shiv" : true,
			"printshiv" : false,
			"load" : true,
			"mq" : false,
			"cssclasses" : true
		},

		// Based on default settings on http://modernizr.com/download/
		"extensibility" : {
			"addtest" : false,
			"prefixed" : false,
			"teststyles" : false,
			"testprops" : false,
			"testallprops" : false,
			"hasevents" : false,
			"prefixes" : false,
			"domprefixes" : false
		},

		// By default, source is uglified before saving
		"uglify" : true,

		// Define any tests you want to impliticly include.
		"tests" : [],

		// By default, this task will crawl your project for references to Modernizr tests.
		// Set to false to disable.
		"parseFiles" : true,

		// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files.
		// You can override this by defining a "files" array below.
		// "files" : [],

		// When parseFiles = true, matchCommunityTests = true will attempt to
		// match user-contributed tests.
		"matchCommunityTests" : false,

		// Have custom Modernizr tests? Add paths to their location here.
		"customTests" : [],

		// Files added here will be excluded when looking for Modernizr refs.
		"excludeFiles" : [
			"env/**/*",
			"robyn/**/*",
			"node_modules/**/*",
			"resources/compass/gems/**/*",
			".{git,sass-cache,robyn}/**/*",
			"project/static/js/**/*.min.js",
			"project/static/js/{libs,test}/**/*"
		]
	});

	grunt.config.set("watch.modernizr", {
		files: [
			"project/static/js/**/*[^.min].js",
			"resources/compass/{sass,scss}/**/*.scss"
		],
		tasks: ["modernizr"]
	});

	grunt.config.set("build.modernizr", "modernizr");

	grunt.loadNpmTasks("grunt-modernizr");

};
