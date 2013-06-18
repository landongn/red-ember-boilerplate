/*jshint node: true */
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		cwd = process.cwd(),
		rosy = require(path.join(__dirname, "..", "plugin.json")),
		source = rosy.config.scope;

	var logPlugins = function (filtered) {
		for (var i = 0, j = filtered.length; i < j; i++) {
			var plug = filtered[i];
			grunt.log.writeln("[+] ".grey + "%n".replace("%n", plug.shortname).cyan);
		}
	};

	grunt.registerTask("rosy", "Install Rosy components", function (components) {
		var done = this.async();
		var https = require("https");

		components = (components || "").split(",");

		var options = {
			"host": "api.github.com",
			"path": "/orgs/rosy-components/repos",
			"headers": {
				"User-Agent": "Node.js"
			}
		};

		https.get(options, function (res) {
			var data = [];

			res.on("data", function (chunk) {
				data.push(chunk);
			});

			res.on("end", function () {
				var repos = JSON.parse(data.join("")).map(function (repo) {
					return {
						clone_url : repo.clone_url,
						name : repo.name,
						shortname : repo.name.replace(/^rosy\-/, "")
					};
				});

				if (!components[0]) {
					grunt.log.writeln();
					grunt.log.writeln("[*] ".grey + "Available plugins:".magenta);

					logPlugins(repos);

					grunt.log.writeln();
					grunt.log.writeln("Install plugins with grunt rosy:plugin-name");
				} else {
					var bower = require("bower");
					var _ = grunt.util._;

					// Change directory to Rosy root
					process.chdir(path.join(cwd, source));

					// Read .bowerrc settings into bower.config
					var rc = JSON.parse(fs.readFileSync(path.join(cwd, source, ".bowerrc")));
					_.extend(bower.config, rc);

					var title;

					var install = repos.filter(function (repo) {
						return components.indexOf(repo.shortname) !== -1;
					}).map(function (repo) {
						return repo.clone_url;
					});

					bower.commands.install(install).on("data", function (data) {
						process.stdout.write("    " + data);
					}).on("end", function (data) {
						if (!grunt.option("verbose")) {
							grunt.log.ok();
						}

						process.chdir(cwd);
						return done;
					});
				}
			});

		});
	});

	grunt.config.set("watch.rosy", {
		files: [
			path.join(source, "*.js"),
			path.join(source, grunt.template.process("<%= meta.projectName %>"), "**", "*.js")
		],
		options: {
			interrupt: true,
			livereload: true
		}
	});

};
