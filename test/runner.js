// Start a pristine Robyn project
// This test expects a Robyn nest called 'robyn-test'
// Add: `robyn add robyn-test git://github.com/ff0000/robyn.git`
(function () {
	var robyn = require("./robyn");

	robyn.check(function () {
		var Mocha = require("mocha");

		var mocha = new Mocha({
			setup : "bdd",
			reporter : process.env.TRAVIS ? "tap" : "spec",
			slow : 20000,
			timeout : 180000
		});

		mocha.addFile("test/tasks.js");

		// Custom Functionality
		mocha.addFile("test/custom/build.js");
		mocha.addFile("test/custom/bump.js");
		mocha.addFile("test/custom/push.js");
		mocha.addFile("test/custom/tasks.js");

		mocha.addFile("test/plugins.js");

		// Plugins
		mocha.addFile("test/plugins/caboose.js");
		mocha.addFile("test/plugins/modernizr.js");
		mocha.addFile("test/plugins/red-start.js");
		mocha.addFile("test/plugins/rosy.js");
		mocha.addFile("test/plugins/statix.js");

		var runner = mocha.run();

		runner.on("fail", function (test, err) {
			process.stderr.write("         " + err.toString() + "\n\n");
			process.exit(1);
		});

	});
}());
