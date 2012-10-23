var Mocha = require("mocha");

var mocha = new Mocha({
	setup : "bdd",
	reporter : "spec",
	timeout : 30000
});

mocha.addFile("test/tasks.js");
mocha.run();
