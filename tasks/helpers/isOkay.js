/*global module:false*/
module.exports = function (grunt) {

	var isOkay = function (file, include, exclude) {
		var ok = false;
		var re;

		for (var i = 0; i < include.length; i ++) {
			re = include[i];
			if (re.test(file)) {
				ok = true;
				break;
			}
		}
		for (i = 0; i < exclude.length; i ++) {
			re = exclude[i];
			if (re.test(file)) {
				ok = false;
				break;
			}
		}
		return ok;
	};

	return isOkay;

};
