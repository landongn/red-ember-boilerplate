/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("install", "Install a plugin", function () {
		var done = this.async();

		grunt.helper("check_initialized", function (initialized) {
			if (!initialized) {
				done(false);
			}
		});

		var plugArr = arguments;

		if (!plugArr.length) {
			grunt.helper("check_for_available_plugins", done);
		} else {
			var i = 0;

			var tmpDir = ".rbp-temp";
			var fs = require("fs");
			var wrench = require("wrench");

			if (fs.existsSync(tmpDir)) {
				wrench.rmdirSyncRecursive(tmpDir, true);
			}

			grunt.file.mkdir(tmpDir);
			grunt.file.setBase(tmpDir);

			(function install (count) {
				if (!plugArr[count]) {
					return;
				}

				grunt.helper("install_plugin", plugArr[count], function (stop) {
					if (stop === true) {
						done(false);
						return;
					}

					count++;

					if (plugArr[count]) {
						install(count);
					} else {
						grunt.file.setBase("../");
						wrench.rmdirSyncRecursive(tmpDir, true);

						done();
					}
				});
			}(i));
		}
	});

};
