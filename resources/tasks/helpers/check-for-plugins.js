/*global module:false*/
var pkg = require("../utils/pkg");

module.exports = function (grunt) {

	grunt.registerHelper("check_for_available_plugins", function (cb) {
		if (!pkg.repository) {
			cb([]);
		}

		var url = require("url");
		var http = require("http");
		var https = require("https");

		var repo = pkg.repository.url;
		var parts = url.parse(repo);
		var host = "api.github.com";
		var pathname = parts.pathname.replace(".git", "");
		var path = "/repos%s/branches".replace("%s", pathname);

		var plugins = [];

		var options = {
			host: host,
			port: 443,
			path: path,
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		var getJSON = function (options, onResult) {
			var port = options.port == 443 ? https : http;
			var req = port.request(options, function (res) {
				var output = "";

				res.setEncoding("utf8");

				res.on("data", function (chunk) {
					output += chunk;
				});

				res.on("end", function() {
					var obj = JSON.parse(output);
					onResult(obj);
				});
			});

			req.on("error", function(err) {
				console.log("error: " + err.message);
			});

			req.end();
		};

		console.log(("[!]".magenta + " Checking for available plugins.".grey).bold);
		console.log("    Pinging GitHub at %s".replace("%s", pkg.repository.url).grey);

		getJSON(options, function (branches) {
			var i, j, branch;

			for (i = 0, j = branches.length; i < j; i++) {
				branch = branches[i];
				if ((/^plugins\//).test(branch.name)) {
					plugins.push(branch.name.replace("plugins/", ""));
				}
			}

			if (cb) {
				cb(plugins.sort());
			}
		});
	});

};
