module.exports = function(grunt) {

	grunt.registerTask("tasks", "List all tasks", function () {

		var path = require('path');

		// Initialize task system so that the tasks can be listed.
		grunt.task.init([], {help: true});

		// Build 2-column array for table view.
		var col1len = 0;
		var opts = Object.keys(grunt.cli.optlist).map(function(long) {
			var o = grunt.cli.optlist[long];
			var col1 = '--' + (o.negate ? 'no-' : '') + long + (o.short ? ', -' + o.short : '');
			col1len = Math.max(col1len, col1.length);
			return [col1, o.info];
		});

		var tasks = Object.keys(grunt.task._tasks).map(function(name) {
			col1len = Math.max(col1len, name.length);
			var info = grunt.task._tasks[name].info;
			if (grunt.task._tasks[name].multi) {
				info += ' *';
			}
			return [name, info];
		});

		// Widths for options/tasks table output.
		var widths = [1, col1len, 2, 76 - col1len];

		grunt.log.writeln("");
		tasks.forEach(function(a) {

			var b = a[0].split(":"),
					c = a[1];


			if (b.length > 1) {
				b[1] = b[1].yellow;
			}

			b = b.join(":");

			if (b !== "tasks") {
				grunt.log.writetableln(widths, ['', grunt.utils._.pad(b.green, col1len), '', c.cyan]);
			}
		});
		grunt.log.writeln("");

		process.exit();
	});

};
