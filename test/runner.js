var Mocha = require("mocha");

var mocha = new Mocha({
	setup : "bdd",
	reporter : "spec",
	timeout : 180000
});

mocha.addFile("test/tasks.js");

// Custom Functionality
mocha.addFile("test/custom/build.js");
mocha.addFile("test/custom/bump.js");
mocha.addFile("test/custom/tasks.js");

// Plugins
mocha.addFile("test/plugins/caboose.js");
mocha.addFile("test/plugins/modernizr.js");
mocha.addFile("test/plugins/red-start.js");
mocha.addFile("test/plugins/rosy.js");
mocha.addFile("test/plugins/statix.js");

mocha.run();
