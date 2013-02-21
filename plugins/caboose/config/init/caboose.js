/*jslint node: true */
"use strict";

module.exports = function (grunt, cb) {
	var fs = require("fs"),
		cwd = process.cwd(),
		path = require("path"),
		pkgPath = path.join(__dirname, "..", "..", "plugin.json");

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
		if (fs.existsSync(pkgPath)) {
			var pkg = require(pkgPath),
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
			args: ["install", "--path", ".bundle"],
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
		var gempath = path.join(__dirname, "../Gemfile");

		if (fs.existsSync(gempath)) {
			copy(gempath, cwd + "/Gemfile");
			copy(gempath + ".lock", cwd + "/Gemfile.lock");
		}

		installGems();
	};

	var removeCabooseTests = function () {
		if (fs.existsSync(pkgPath)) {
			var pkg = require(pkgPath),
				wrench = require("wrench"),
				testpath = path.join(cwd, pkg.config.scope, "test");

			if (fs.existsSync(testpath)) {
				wrench.rmdirSyncRecursive(testpath);
			}
		}

		moveGemfileToRoot();
	};

	var moveHTCToImageDir = function () {
		if (fs.existsSync(pkgPath)) {
			var pkg = require(pkgPath),
				file = "boxsizing.htc",
				dirpath = path.join(cwd, pkg.config.scope, "images"),
				htcpath = path.join(dirpath, file);

			if (fs.existsSync(dirpath) && fs.existsSync(htcpath)) {
				copy(htcpath, path.join(cwd, pkg.config.scope, "img", file));

				fs.unlinkSync(htcpath);
				fs.rmdirSync(dirpath);
			}
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
