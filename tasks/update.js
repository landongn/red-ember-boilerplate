/*jshint node:true*/
module.exports = function (grunt) {
	"use strict";

	grunt.registerTask("update", "Update the boilerplate", function (plugin) {
		var done = this.async();

		var cwd = process.cwd();
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

		var packageCheck = function () {
			var fs = require("fs");
			var path = require("path");
			var semver = require("semver");

			var localPath = path.join(cwd, "package.json");
			var robynPath = path.join(cwd, pkg.config.dirs.robyn, "robyn.json");
			var pristinePath = path.join(cwd, pkg.config.dirs.robyn, "package.json");

			if (!fs.existsSync(localPath) || !fs.existsSync(robynPath) || !fs.existsSync(pristinePath)) {
				return pluginCheck();
			}

			var localPkg = require(localPath);
			var robynPkg = require(robynPath);
			var pristinePkg = require(pristinePath);

			var deps = pristinePkg.dependencies;
			var key, local;

			var equals = ["name", "version", "author", "description"];

			for (key in equals) {
				localPkg[key] = robynPkg[key];
			}

			for (key in deps) {
				local = localPkg.dependencies[key];

				if (!local || semver.gt(deps[key], local)) {
					localPkg.dependencies[key] = deps[key];
				}
			}

			fs.writeFileSync(localPath, JSON.stringify(localPkg, null, "\t") + "\n");

			grunt.helper("spawn", {
				cmd: "npm",
				args: ["install", "--production"],
				title: "Installing npm modules",
				complete: function (code) {
					if (code !== 0) {
						done(false);
					}

					pluginCheck();
				}
			});
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

					packageCheck();
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

			var semver = require("semver");

			var currentVersion = pkg.version;

			var tagRegExp = new RegExp(
				"\\s*[v=]*\\s*([0-9]+)" +            // major
				"\\.([0-9]+)"  +                     // minor
				"\\.([0-9]+)"  +                     // patch
				"(-[0-9]+-?)?" +                     // build
				"([a-zA-Z-+][a-zA-Z0-9-\\.:]*)?" +   // tag
				"$"
			);

			var tags = out.split("\n").map(function (line) {
				var match = line.match(tagRegExp) || [];
				return match[0];
			}).filter(function (line) {
				return line;
			});

			var filtered = currentVersion;

			tags.forEach(function (tag) {
				if (!tag) {
					return;
				}

				var gt = semver.gt(tag, filtered);

				if (gt) {
					filtered = semver.clean(tag);
				}
			});

			if (semver.gt(filtered, currentVersion)) {
				var prompt = require("prompt");
				prompt.message = (prompt.message !== "prompt") ? prompt.message : "[?]".white;
				prompt.delimiter = prompt.delimter || " ";

				grunt.log.writeln();

				prompt.start();

				var message = [
					"An updated version of your boilerplate (".magenta +
						filtered.white.bold + ") has been found.\n   ".magenta,
					"Your current version: ".magenta + currentVersion + "\n   ",
					"Would you like to upgrade?".magenta
				].join(" ");

				prompt.get([{
					name: "force",
					message: message,
					validator: /[y\/n]+/i,
					"default": "Y/n"
				}], function (err, props) {
					if (err) {
						done(err);
					}

					testAssertion(props, filtered);
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
