/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		caboose = require(path.join(__dirname, "../plugin.json")),
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

	var timeSince = new Date().getTime();

	grunt.registerTask("pulverizr", "Crunch your images", function (watch) {
		var done = this.async(),
			output = path.join(cwd, "project/static/img"),
			pulverizr = require("pulverizr"),
			wrench = require("wrench"),
			options = {},
			modifiedFiles;

		// Stop if no images found
		if (!fs.existsSync(source)) {
			return done;
		}

		// Make sure parent directory exists
		if (!fs.existsSync(path.join(cwd, output))) {
			wrench.mkdirSyncRecursive(path.join(cwd, output));
		}

		if (watch) {
			modifiedFiles = wrench.readdirSyncRecursive(source).filter(function (img) {
				var stats = fs.statSync(path.join(source, img));
				var isImage = stats.isFile() && (/\.(gif|png|jp(e)?g)/).test(img);
				return isImage && stats.ctime.getTime() > timeSince;
			});

			var staticFiles = modifiedFiles.map(function (img) {
				return path.join(output, img);
			});

			modifiedFiles = modifiedFiles.map(function (img) {
				return path.join(source, img);
			});

			// Pristine copy
			for (var i = 0, j = modifiedFiles.length; i < j; i++) {
				var img = modifiedFiles[i];
				var copy = staticFiles[i];

				grunt.helper("writeln", ("Changes in " + img).yellow);

				var content = fs.readFileSync(img);

				if (!fs.existsSync(path.dirname(copy))) {
					wrench.mkdirSyncRecursive(path.dirname(copy));
				}

				fs.writeFileSync(copy, content);

				grunt.helper("writeln", "");
			}

			output = staticFiles;
		} else {
			wrench.copyDirSyncRecursive(source, output);

			output = [output];
			options.recursive = true;
		}

		// Start Pulverizr
		var job = pulverizr.createJob(output, options);

		job.on("start", function () {
			grunt.helper("writeln", "Starting optimizations...".grey);
			grunt.helper("writeln", "");
		});

		job.on("compression", function (data) {
			grunt.helper("writeln", getKBs(data.oldSize - data.newSize).cyan + data.filename.replace(cwd + "/", "").grey);
		});

		job.on("error-compression", function (err) {
			var error = err.error;

			grunt.helper("writeln", ("Couldn't compress '" + err.filename + "' with " + err.compressor).red);

			if (error) {
				error = error.split("\n");
				error.forEach(function (line) {
					if (line) {
						grunt.helper("writeln", line.red);
					}
				});
			}
		});

		job.on("error-compressor", function (err) {
			grunt.helper("writeln", "Couldn't find '" + err.compressor + "'. Skipping on: " + err.filename);
		});

		job.on("finish", function (report) {
			setTimeout(function () {
				grunt.helper("writeln", "");
				grunt.helper("writeln", ("Scanned " + report.fileCount + " files").cyan);
				grunt.log.ok((" Saved " + Math.ceil((report.size.start - report.size.end) / 1024) + "kb").cyan);

				timeSince = new Date().getTime();
				done();
			}, 100);
		});

		job.run();
	});

	grunt.config.set("watch.pulverizr", {
		files : [path.join(source, "**/*.{gif,png,jpeg,jpg}")],
		tasks : ["pulverizr:watch"]
	});

	grunt.config.set("build.pulverizr", ["pulverizr"]);
};
