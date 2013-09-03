/* jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		output = path.join("project", "static"),
		source = path.join("project", "source");

	grunt.config.set("webfont.caboose", {

		// Glyphs list: SVG or EPS. String or array. Wildcards are supported.
		src: path.join(source, "icons", "**", "*.{svg,eps}"),

		// Directory for resulting files.
		dest: path.join(output, "fonts"),

		// Directory for resulting CSS files (if different than font directory).
		destCss: path.join(source, "scss", "project", "fonts"),

		options: {

			// Name of font and base name of font files.
			font: "icons",

			// Append font file names with unique string to flush browser cache when you update your icons.
			hashes: true,

			// List of styles to be added to CSS files:
			// - font (font-face declaration)
			// - icon (base .icon class)
			// - extra (extra stuff for Bootstrap (only for syntax = 'bootstrap')
			styles: ["font", "icon"],

			// Font files types to generate.
			types: ["woff", "ttf", "eot", "svg"],

			// Icon classes syntax.
			// - bem (double class names: icon icon_awesome)
			// - bootstrap (single class names: icon-awesome)
			syntax: "bootstrap",

			// Custom CSS template path (see tasks/templates for some examples).
			// Should be used instead of syntax. (You probably need to define htmlDemoTemplate option too.)
			template: null,

			// Stylesheet type. Can be css, sass, scss, less...
			// If sass or scss is used, _ will prefix the file (so it can be a used as a partial).
			stylesheet: "scss",

			// Custom font path. Will be used instead of destCss in CSS file. Useful with CSS preprocessors.
			relativeFontPath: "../fonts",

			// If true, an HTML file will be available (by default, in destCSS folder) to test the render.
			htmlDemo: false,

			// Custom demo HTML template path (see tasks/templates/demo.html for an example)
			// (requires htmlDemo option to be true).
			htmlDemoTemplate: null,

			// Custom demo HTML demo path (requires htmlDemo option to be true).
			destHtml: "<% webfont.caboose.destCss %>",

			// If true embeds WOFF (*only WOFF*) file as data:uri.
			// IF 'ttf' or 'woff' or 'ttf,woff' embeds TTF or/and WOFF file.
			// If there’re more file types in types option they will be
			// included as usual url(font.type) CSS links.
			embed: false,

			// If true the generated font files and stylesheets will be generated
			// with opentype ligature features. The character sequences to be replaced
			// by the ligatures are determined by the file name (without extension)
			// of the original SVG or EPS.
			//
			// For example, you have a heart icon in love.svg file.
			// The HTML <h1>I <span class="ligature-icons">love</span> you!</h1>
			// will be rendered as I ♥ you!.
			ligatures: false,

			// If true task will not be ran.
			// In example, you can skip task on Windows (becase of difficult installation):
			// skip: require('os').platform() === 'win32'
			skip: false

		}
	});

};
