/*jslint node: true */

var config = require('../../plugin.json').config;
var cwd = process.cwd();
var path = require('path');
var fs = require('fs');

var admin_path = null;
for (var i = 0; i < config.admin_path.length; i++) {
	admin_path = path.join(admin_path, config.admin_path[i]);
}

exports.source_path_rel = path.join(admin_path, 'source');
exports.static_path_rel = path.join(admin_path, 'static', 'scarlet');
exports.source_path = path.join(cwd, exports.source_path_rel);
exports.static_path = path.join(cwd, exports.static_path_rel);

exports.base_source = path.join(cwd, 'project', 'source');
exports.base_js_source = path.join(exports.base_source, "js");
if (!fs.existsSync(exports.base_source)) {
	exports.base_source = path.join(cwd, 'resources');
	exports.base_js_source = path.join(cwd, "project", "static", "js");
}
exports.cwd = cwd;
