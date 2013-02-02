/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		caboose = require(path.join(__dirname, "../plugin.json")),
		output = path.join(process.cwd(), "project/static/img"),
		source = path.join(caboose.config.scope, "img");

	function getKBs(val) {
		var num = (parseInt(val, 10) / 1000).toFixed(2);
		var str = num.toString();
		var spacer = new Array(10 - (str.length)).join(" ");

		if (num < 0) {
			str = (str + "kb").cyan + " ";
		} else {
			str = ("+" + str + "kb").yellow;
		}

		return str + spacer;
	}

	grunt.registerTask("pulverizr", "Crunch your images", function () {
		var done = this.async(),
			pulverizr = require("pulverizr"),
			wrench = require("wrench");

		console.log(this, arguments);

		// Stop if no images found
		if (!fs.existsSync(source)) {
			return done;
		}

		// Make sure parent directory exists
		wrench.mkdirSyncRecursive(output);

		// Pristine copy
		wrench.copyDirSyncRecursive(source, output);

		// Start Pulverizr
		var job = pulverizr.createJob([output], {
			recursive : true
		});

		job.on("start", function () {
			grunt.helper("writeln", "Starting optimizations...".grey);
			grunt.helper("writeln", "");
		});

		job.on("compression", function (data) {
			grunt.helper("writeln", getKBs(data.oldSize - data.newSize).cyan + data.filename.replace(process.cwd() + "/", "").grey);
		});

		job.on("error-compression", function (err) {
			var error = err.error;

			grunt.helper("writeln", ("Couldn't compress '" + err.filename + "' with " + err.compressor).red);

			if (error) {
				error = error.split("\n");
				error.forEach(function (line) {
					if (line) {
						console.error(line.red);
					}
				});
			}
		});

		job.on("error-compressor", function (err) {
			grunt.helper("writeln", "Couldn't find '" + err.compressor + "'. Skipping on: " + err.filename);
		});

		job.on("finish", function (report) {
			grunt.helper("writeln", "");
			grunt.helper("writeln", ("Scanned " + report.fileCount + " files").cyan);
			grunt.log.ok((" Saved " + Math.ceil((report.size.start - report.size.end) / 1024) + "kb").cyan);

			done();
		});

		job.run();
	});

	grunt.config.set("watch.pulverizr", {
		files : [path.join(source, "**/*.{gif,png,jpeg,jpg,webm}")],
		tasks : ["pulverizr"]
	});

	grunt.config.set("build.pulverizr", ["pulverizr"]);
};
