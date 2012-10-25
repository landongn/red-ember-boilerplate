module.exports = (function () {
	var nexpect = require("nexpect");

	var cp = require("child_process");
	var path = require("path");
	var test = path.join(process.cwd(), "build");

	return {
		spawn : function (task, opts) {
			var args = task ? [task] : null;
			opts = opts || {};

			return nexpect.spawn.call(nexpect, "grunt", args, {
				cwd: opts.cwd || test,
				stripColors: opts.stripColors || true,
				verbose: opts.verbose || false
			});
		},

		run : function (args, callback) {
			args = args.split(" ");

			var child = cp.spawn("grunt", args, {
				cwd: test,
				stdio: "pipe"
			});

			var stdout = "";
			var stderr = "";

			child.stdout.on("data", function (data) {
				stdout += data;
			});

			child.stderr.on("data", function (data) {
				stderr += data;
			});

			child.on("exit", function (code) {
				if (callback) {
					callback(code, stdout, stderr);
				}
			});
		}
	};
}());
