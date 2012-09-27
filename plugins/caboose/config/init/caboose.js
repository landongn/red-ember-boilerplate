/*jslint node: true, onevar: false */
/*global jake, desc, task, error, pkg, installModule, parseFiles */
"use strict";

module.exports = {
	exec : function (exec, args, cwd, suppress, doneCB) {
		var cp = require("child_process"),
			child, data;

		child = cp.spawn(exec, args || [], {
			cwd: cwd,
			env: null,
			setsid: true,
			stdio: (suppress) ? null : "inherit"
		});

		if (child.stdout) {
			data = "";

			child.stdout.on("data", function (buffer) {
				data += buffer.toString();
			});
		}

		child.on("exit", function (code) {
			doneCB(!code, data);
		});
	},

	copy : function (source, destination) {
		var fs = require("fs"),
			BUF_LENGTH = 64 * 1024,
			_buff = new Buffer(BUF_LENGTH);

		function _copyFileSync(srcFile, destFile) {
			var bytesRead, fdr, fdw, pos;
			fdr = fs.openSync(srcFile, "r");
			fdw = fs.openSync(destFile, "w");
			bytesRead = 1;
			pos = 0;

			while (bytesRead > 0) {
				bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
				fs.writeSync(fdw, _buff, 0, bytesRead);
				pos += bytesRead;
			}

			fs.closeSync(fdr);
			return fs.closeSync(fdw);
		}

		return _copyFileSync(source, destination);
	},

	installGems : function () {
		this.exec("bundle", ["install", "--path", "resources/compass/gems"], null, false, function (success, data) {
			if (!success) {
				return this.exit("No executable named bundle found.");
			}

			return this.exit();
		}.bind(this));
	},

	moveGemfileToRoot : function () {
		var fs = require("fs"),
			path = require("path"),
			gempath = path.join(__dirname, "../Gemfile");

		if (fs.existsSync(gempath)) {
			this.copy(gempath, process.cwd() + "/Gemfile");
			this.copy(gempath + ".lock", process.cwd() + "/Gemfile.lock");
		}

		this.installGems();
	},

	exit : function (error) {
		if (this.cb) {
			this.cb(error);
		} else {
			process.exit();
		}
	},

	run : function (cb) {
		this.cb = cb;
		this.moveGemfileToRoot();
	}
};
