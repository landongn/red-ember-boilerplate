/*jslint node: true, onevar: false */
/*global jake, desc, task */

var ExecQueue = function (silent) {
	this.commands = [];
	this.silent = silent;
};

ExecQueue.prototype.add = function () {
	for (var i = 0; i < arguments.length; i ++) {
		var arg = arguments[i];
		var regexp = /["|']+(.*)["|']+/;
		var match = arg.match(regexp);

		if (match && match[1]) {
			arg = arg.replace(match[1], match[1].replace(/\s/, "%20"));
		}

		var cmd = arg.split(" "),
			j, k;

		for (j = 0, k = cmd.length; j < k; j++) {
			cmd[j] = cmd[j].replace(/\%20/g, " ");
		}

		this.commands.push([cmd.shift(), cmd]);
	}
	return this;
};

ExecQueue.prototype.run = function (cwd, cb, success) {

	if (typeof cwd === "function") {
		cb = cwd;
		cwd = null;
	}

	if (this.commands.length === 0) {
		return cb ? cb(success || false) : "";
	}

	var cmd = this.commands.shift();

	var cp = require("child_process");
	var child = cp.spawn(cmd[0], cmd[1], {cwd: cwd, env: null, setsid: true});

	if (!this.silent) {
		child.stdout.pipe(process.stdout, {end: false});
		child.stdin.pipe(process.stdin, {end: false});
		child.stderr.pipe(process.stderr, {end: false});

		child.stdout.setEncoding('utf8');
		child.stderr.setEncoding('utf8');
	}

	child.on("exit", function (code) {
		this.run(cwd, cb, !code);
	}.bind(this));
};

module.exports = ExecQueue;
