/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {

	var copy = function (source, destination) {
		var fs = require("fs"),
			BUF_LENGTH = 64 * 1024,
			_buff = new Buffer(BUF_LENGTH);

		var bytesRead, fdr, fdw, pos;
		fdr = fs.openSync(source, "r");
		fdw = fs.openSync(destination, "w");
		bytesRead = 1;
		pos = 0;

		while (bytesRead > 0) {
			bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
			fs.writeSync(fdw, _buff, 0, bytesRead);
			pos += bytesRead;
		}

		fs.closeSync(fdr);
		return fs.closeSync(fdw);
	};

	var removeConfig = function () {
		var fs = require("fs"),
			path = require("path"),
			pkgPath = path.join(__dirname, "..", "..", "plugin.json");

		if (fs.existsSync(pkgPath)) {
			var pkg = require(pkgPath),
				cwd = process.cwd(),
				rbPath = path.join(cwd, pkg.config.scope, "config.rb");

			if (fs.existsSync(rbPath)) {
				fs.unlinkSync(rbPath);
				return exit();
			} else {
				return exit();
			}
		} else {
			return exit();
		}
	};

	var installGems = function () {
		grunt.helper("spawn", {
			cmd: "bundle",
			args: ["install", "--path", ".bundle/gems"],
			title: "Installing bundle. This may take a minute",
			complete: function (code) {
				if (code !== 0) {
					return exit("No executable named bundle found.");
				}

				removeConfig();
			}
		});
	};

	var moveGemfileToRoot = function () {
		var fs = require("fs"),
			path = require("path"),
			gempath = path.join(__dirname, "../Gemfile");

		if (fs.existsSync(gempath)) {
			copy(gempath, process.cwd() + "/Gemfile");
			copy(gempath + ".lock", process.cwd() + "/Gemfile.lock");
		}

		installGems();
	};

	var removeCabooseTests = function () {
		var fs = require("fs"),
			path = require("path"),
			wrench = require("wrench"),
			testpath = path.join(process.cwd(), "resources/compass/test");

		if (fs.existsSync(testpath)) {
			wrench.rmdirSyncRecursive(testpath);
		}

		moveGemfileToRoot();
	};

	var moveHTCToImageDir = function () {
		var fs = require("fs"),
			path = require("path"),
			file = "boxsizing.htc",
			dirpath = path.join(process.cwd(), "resources/compass/images"),
			htcpath = path.join(dirpath, file);

		if (fs.existsSync(dirpath) && fs.existsSync(htcpath)) {
			copy(htcpath, path.join(process.cwd(), "project/static/img", file));

			fs.unlinkSync(htcpath);
			fs.rmdirSync(dirpath);
		}

		return removeCabooseTests();
	};

	var exit = function (error) {
		if (cb) {
			cb(error);
		} else {
			process.exit();
		}
	};

	moveHTCToImageDir();

};
