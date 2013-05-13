/* jshint node: true */
"use strict";

module.exports = function (grunt) {

	var fs = require("fs"),
		cwd = process.cwd(),
		path = require("path"),
		rosy = require(path.join(__dirname, "..", "plugin.json")),
		output = path.join("project", "static", "js"),
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

		var url = "https://api.github.com/orgs/rosy-components/repos";

		https.get(url, function (res) {
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
					grunt.log.writeln("Install plugins with grunt install:rosy-plugin-name");
				} else {
					var bower = require("bower");

					// Change directory to Rosy root
					process.chdir(path.join(cwd, source));

					var title;

					var install = repos.filter(function (repo) {
						return components.indexOf(repo.shortname) !== -1;
					}).map(function (repo) {
						return repo.clone_url;
					});

					bower.commands.install(install).on("data", function (data) {
						console.log("    " + data);
					}).on("end", function (data) {
						if (!grunt.option("verbose")) {
							process.stdout.write("OK".green);
						}

						process.chdir(cwd);
						return done;
					});
				}
			});

		});
	});

};
