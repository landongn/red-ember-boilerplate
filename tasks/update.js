/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var done = this.async();

		var pkg = require("./utils/pkg");

		// Sanity check
		pkg.repository = pkg.repository || {};

		// Set plugin if not deflined
		plugin = plugin || pkg.name;

		var branch;
		var bits = plugin.split("@");

		if (bits.length === 1) {
			plugin = bits[0];
		} else {
			plugin = bits[0];
			branch = bits[1];
		}

		var pluginCheck = function () {
			var install;

			if (plugin !== pkg.name) {
				branch = branch || "master";
				install = "install:%p@%b:update";
				install = install.replace("%p", plugin);
				install = install.replace("%b", branch);

				grunt.task.run(install);
			}

			done();
		};

		var onFetch = function (code, tag) {
			grunt.helper("spawn", {
				cmd: "git",
				args: ["checkout", tag],
				cwd: pkg.config.dirs.robyn,
				title: "Updating to version " + tag,
				complete: function (code) {
					if (code !== 0) {
						done(false);
					}

					pluginCheck();
				}
			});
		};

		var testAssertion = function (props, tag) {
			var assert = grunt.helper("get_assertion", props.force);

			if (assert) {
				grunt.helper("spawn", {
					cmd: "git",
					args: ["fetch", "--all"],
					cwd: pkg.config.dirs.robyn,
					title: "Fetching latest from origin remote",
					complete: function (code, err, out) {
						onFetch(code, tag);
					}
				});
			} else {
				done();
			}
		};

		var onListTags = function (code, err, out) {
			if (code !== 0) {
				done(false);
			}

			var currentVersion = pkg.version;
			var tagRegExp = /refs\/tags\/([\d]+\.[\d]+\.[\d]+)$/;

			var tag = out.split("\n").filter(function (line) {
				var match = line.match(tagRegExp);

				if (match && match[1]) {
					var cBits = currentVersion.split(".");
					var mBits = match[1].split(".");

					var e1 = (mBits[0] === cBits[0]);
					var e2 = (mBits[1] === cBits[1]);

					var g1 = (mBits[0] > cBits[0]);
					var g2 = (mBits[1] > cBits[1]);
					var g3 = (mBits[2] > cBits[2]);

					return (g1 || (e1 && g2) || (e1 && e2 && g3));
				}

				return false;
			}).map(function (line) {
				return line.match(tagRegExp)[1];
			}).sort().pop();

			if (tag) {
				var prompt = require("prompt");
				prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
				prompt.delimiter = prompt.delimter || " ";

				grunt.log.writeln();

				prompt.start();

				var message = [
					"An updated version of your boilerplate (" +
						tag.white + ") has been found.",
					"Would you like to upgrade?"
				].join(" ").magenta;

				prompt.get([{
					name: "force",
					message: message,
					validator: /[y\/n]+/i,
					"default": "Y/n"
				}], function (err, props) {
					if (err) {
						done(err);
					}

					testAssertion(props, tag);
				});
			} else {
				pluginCheck();
			}
		};

		grunt.helper("spawn", {
			cmd: "git",
			args: ["ls-remote", "--tags", "origin"],
			cwd: pkg.config.dirs.robyn,
			title: "Checking for newer version",
			complete: onListTags
		});
	});

};
