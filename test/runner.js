// Start a pristine Robyn project
// This test expects a Robyn nest called 'robyn-test'
// Add: `robyn add robyn-test git://github.com/ff0000/robyn.git`
(function () {
	var robyn = require("./robyn");

	robyn.check(function () {
		var Mocha = require("mocha");

		var mocha = new Mocha({
			setup : "bdd",
			reporter : process.env.TRAVIS ? "list" : "spec",
			timeout : 30000
		});

		mocha.addFile("test/tasks.js");
		mocha.addFile("test/plugins.js");

		var runner = mocha.run();

		runner.on("fail", function (test, err) {
			process.stderr.write("         " + err.toString() + "\n\n");
			process.exit(1);
		});

	});
}());
