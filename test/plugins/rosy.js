/*jshint node:true*/
/*global describe, before, it*/

"use strict";

var grunt = require("../lib/grunt");

describe("Rosy Tasks", function () {

	describe("JSHint", function () {
		it("grunt jshint", function (done) {
			grunt.spawn("jshint")

			.expect('Running "jshint" task')
			.expect('Ok  project/static/js/config.js')
			.expect('Ok  project/static/js/robynTest/config/routes.js')
			.expect('Ok  project/static/js/robynTest/Site.js')
			.expect('Ok  project/static/js/robynTest/views/About.js')
			.expect('Ok  project/static/js/robynTest/views/Contact.js')
			.expect('Ok  project/static/js/robynTest/views/Home.js')
			.expect('Ok  project/static/js/robynTest/views/Page.js')
			.expect('Ok  project/static/js/rosy/base/AbstractClass.js')
			.expect('Ok  project/static/js/rosy/base/Class.js')
			.expect('Ok  project/static/js/rosy/base/DOMClass.js')
			.expect('Ok  project/static/js/rosy/base/NotificationManager.js')
			.expect('Ok  project/static/js/rosy/modules/caboose/Caboose.js')
			.expect('Ok  project/static/js/rosy/modules/custom-form-field/CustomFormField.js')
			.expect('Ok  project/static/js/rosy/modules/google-chrome-frame/ChromeFrame.js')
			.expect('Ok  project/static/js/rosy/modules/ios-page-control/PageControl.js')
			.expect('Ok  project/static/js/rosy/modules/Module.js')
			.expect('Ok  project/static/js/rosy/modules/scroller/Scroller.js')
			.expect('Ok  project/static/js/rosy/modules/ticker/Ticker.js')
			.expect('Ok  project/static/js/rosy/modules/tracking/GATracking.js')
			.expect('Ok  project/static/js/rosy/modules/tracking/OmnitureTracking.js')
			.expect('Ok  project/static/js/rosy/polyfills/array-indexof.js')
			.expect('Ok  project/static/js/rosy/polyfills/function-bind.js')
			.expect('Ok  project/static/js/rosy/polyfills/request-animation-frame.js')
			.expect('Ok  project/static/js/rosy/utils/Utils.js')
			.expect('Ok  project/static/js/rosy/views/TransitionManager.js')
			.expect('Ok  project/static/js/rosy/views/View.js')
			.expect('Ok  project/static/js/rosy/views/ViewGroup.js')
			.expect('Ok  project/static/js/rosy/views/ViewManager.js')
			.expect('Ok  project/static/js/rosy/views/ViewRouter.js')
			.expect('Ok  project/static/js/test/oxblood/core/ExternalLibs.js')
			.expect('Ok  project/static/js/test/oxblood/core/Inheritance.js')
			.expect('Ok  project/static/js/test/oxblood/core/Notifications.js')
			.expect('Ok  project/static/js/test/oxblood/core/Scope.js')
			.expect('Ok  project/static/js/test/oxblood/core/SubClass.js')
			.expect('Ok  project/static/js/test/oxblood/core/Timers.js')
			.expect('Ok  project/static/js/test/oxblood/modules/caboose/Caboose.js')
			.expect('Ok  project/static/js/test/oxblood/modules/custom-form-field/CustomFormField.js')
			.expect('Ok  project/static/js/test/oxblood/modules/google-chrome-frame/ChromeFrame.js')
			.expect('Ok  project/static/js/test/oxblood/modules/ios-page-control/PageControl.js')
			.expect('Ok  project/static/js/test/oxblood/modules/scroller/Scroller.js')
			.expect('Ok  project/static/js/test/oxblood/modules/social/FacebookSocial.js')
			.expect('Ok  project/static/js/test/oxblood/modules/social/TwitterSocial.js')
			.expect('Ok  project/static/js/test/oxblood/modules/ticker/Ticker.js')
			.expect('Ok  project/static/js/test/oxblood/modules/tracking/GATracking.js')
			.expect('Ok  project/static/js/test/oxblood/modules/tracking/OmnitureTracking.js')
			.expect('Ok  project/static/js/test/oxblood/OxBlood.js')
			.expect('Ok  project/static/js/test/oxblood/quality/JSHint.js')
			.expect('Ok  project/static/js/test/oxblood/routing/History.js')
			.expect('Ok  project/static/js/test/oxblood/routing/routes.js')
			.expect('Ok  project/static/js/test/oxblood/routing/Routing.js')
			.expect('Ok  project/static/js/test/oxblood/routing/Transitions.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/About.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Async.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/CanCloseTest.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Contact.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Home.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Page.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Preload.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Reverse.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Sync.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Test1.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Test2.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Test3.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Test4.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/Test5.js')
			.expect('Ok  project/static/js/test/oxblood/routing/views/UpdateTest.js')
			.expect('Ok  project/static/js/test/runner.js')
			.expect('Done, without errors')

			.run(done);
		});
	});

	describe("RequireJS", function () {
		it("grunt requirejs", function (done) {
			grunt.spawn("requirejs")

			.expect('Running "requirejs:desktop" (requirejs) task')

			.expect('Tracing dependencies for: robynTest/site')
			.expect('Cannot optimize network URL, skipping: //ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js')
			.expect('Uglifying file: project/static/js/site.min.js')

			.expect('Built with the following modules:')
			.expect('project/static/js/rosy/utils/Utils.js')
			.expect('project/static/js/rosy/polyfills/function-bind.js')
			.expect('project/static/js/rosy/base/AbstractClass.js')
			.expect('project/static/js/rosy/polyfills/array-indexof.js')
			.expect('project/static/js/rosy/base/NotificationManager.js')
			.expect('project/static/js/rosy/base/Class.js')
			.expect('project/static/js/rosy/base/DOMClass.js')
			.expect('project/static/js/rosy/views/ViewNotification.js')
			.expect('project/static/js/rosy/views/View.js')
			.expect('project/static/js/rosy/views/ViewGroup.js')
			.expect('project/static/js/rosy/views/ViewRouter.js')
			.expect('project/static/js/rosy/views/TransitionManager.js')
			.expect('project/static/js/rosy/views/ViewManager.js')
			.expect('project/static/js/robynTest/config/routes.js')
			.expect('project/static/js/robynTest/site.js')
			.expect('project/static/js/config.js')

			.expect('Done, without errors.')

			.run(done);
		});
	});

});
