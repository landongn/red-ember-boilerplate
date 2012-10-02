module.exports = (function () {
	var pkg = require("./pkg");
	var localPkg = require("./local-pkg");

	var fs = require("fs");
	var path = require("path");

	function rename(obj, origVal, newVal) {
		pkg.config[newVal] = {};

		for (var key in pkg.config[origVal]) {
			pkg.config[newVal][key] = pkg.config[origVal][key];
		}

		delete pkg.config[origVal];
	}

	return {
		versions : {
			"2.5.0" : function () {
				// resources/helpers/check-dependency.js -> resources/helpers/check-dependencies.js
				var oldFile = path.join(__dirname, "../helpers/check-dependency.js");

				if (fs.existsSync(oldFile)) {
					fs.unlinkSync(oldFile);
				}
			},

			"2.6.0" : function () {
				if (pkg.config) {

					// pkg.config.tmpDir
					if (!("tmpDir" in pkg.config)) {
						pkg.config.tmpDir = ".rbp-temp";
					}

					// pkg.config.rbp -> pkg.config.org
					if ("rbp" in pkg.config) {
						rename(pkg.config, "rbp", "org");
					}

					// pkg.config.installed_plugins -> pkg.config.installedPlugins
					if ("installed_plugins" in pkg.config) {
						rename(pkg.config, "installed_plugins", "installedPlugins");
					}

				}
			},

			"2.7.4" : function () {
				if (localPkg.config && !localPkg.config.excludedPaths) {

					// Add default excludedPaths array
					localPkg.config.excludedPaths = [
						".{git,sass-cache}",
						"env",
						"node_modules",
						"uploads",
						"resources/compass/gems"
					];

				}
			}
		},
		run : function (cb) {
			var versions = this.versions,
				version;

			for (version in versions) {
				versions[version]();
			}

			pkg.save();
			localPkg.save();

			if (cb) {
				cb();
			}
		}
	};
}());
