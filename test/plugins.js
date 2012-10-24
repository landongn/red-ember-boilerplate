describe("Plugin Integrity", function () {
	var fs = require("fs");
	var path = require("path");
	var cwd = path.join(process.cwd(), "build");
	var expect = require("expect.js");
	var nexpect = require("nexpect");
	var globber = require("glob-whatev");

	var pkgPath = path.join(cwd, "robyn.json");
	expect(fs.existsSync(pkgPath)).to.be.ok();

	var pkg = require(pkgPath);
	expect(pkg).to.be.an("object");

	var robynPath = pkg.config.dirs.robyn;
	expect(robynPath).to.equal(".robyn");

	robynPath = path.join(cwd, robynPath);
	expect(fs.existsSync(robynPath)).to.be.ok();

	var robynPkg = require(path.join(robynPath, "package.json"));
	expect(robynPkg).to.be.an("object");

	var plugPath = robynPkg.config.dirs.plugins;
	expect(plugPath).to.equal("plugins");

	plugPath = path.join(robynPath, plugPath);
	expect(fs.existsSync(plugPath)).to.be.ok();

	globber.glob(path.join(plugPath, "*")).forEach(function (filepath) {
		var stats = fs.statSync(filepath);

		if (stats.isDirectory()) {
			var plugPkg = require(path.join(filepath, "plugin.json"));

			if (!pkg.installedPlugins[plugPkg.name]) {
				return;
			}

			describe(path.basename(filepath, "/"), function () {
				it("package information", function () {
					expect(plugPkg).to.be.an("object");
					expect(plugPkg.name).to.be.ok();
					expect(plugPkg.description).to.be.ok();
				});

				it("plugin dependencies", function (done) {
					var plugDeps = plugPkg.dependencies || {};

					var keys = Object.keys(plugDeps);

					if (!keys.length) {
						return done();
					}

					var nodeDir = path.join(cwd, "node_modules");
					expect(fs.existsSync(nodeDir)).to.be.ok();

					for (var i = 0, j = keys.length; i < j; i++) {
						var npmModuleDir = path.join(nodeDir, keys[i]);
						expect(fs.existsSync(npmModuleDir)).to.be.ok();
					}

					done();
				});

				it("system dependencies", function () {
					var pkgDeps = pkg.systemDependencies;
					expect(pkgDeps).to.be.an("object");

					var plugDeps = plugPkg.systemDependencies;
					expect(plugDeps).to.be.an("object");

					for (var key in plugDeps) {
						expect(pkgDeps[key]).to.be.ok();
						expect(plugDeps[key]).to.eql(pkgDeps[key]);
					}
				});

				var pkgReqPaths = (pkg.config || {}).requiredPaths;
				var plugReqPaths = (plugPkg.config || {}).requiredPaths;

				if (plugReqPaths) {
					it("required paths", function () {
						for (var i = 0, j = plugReqPaths.length; i < j; i++) {
							var req = plugReqPaths[i];
							expect(pkgReqPaths.indexOf(req)).to.not.equal(-1);
							expect(fs.existsSync(path.join(cwd, req))).to.be.ok();
						}
					});
				}

				var pkgExcPaths = (pkg.config || {}).excludedPaths;
				var plugExcPaths = (plugPkg.config || {}).excludedPaths;

				if (plugExcPaths) {
					it("excluded paths", function () {
						for (var i = 0, j = plugExcPaths.length; i < j; i++) {
							var req = plugExcPaths[i];
							expect(pkgExcPaths.indexOf(req)).to.not.equal(-1);
							expect(fs.existsSync(path.join(cwd, req))).to.be.ok();
						}
					});
				}

				describe("scripts", function () {
					it("install", function (done) {
						var plugScript = (plugPkg.scripts || {}).install;

						if (!plugScript) {
							return done();
						}

						var r = pkg.config.dirs.robyn;
						var p = robynPkg.config.dirs.plugins;
						plugScript = plugScript.replace(/^\./, path.join(r, p, plugPkg.name));

						var pkgScripts = pkg.scripts.install;

						expect(fs.existsSync(path.join(cwd, plugScript))).to.be.ok();
						expect(pkgScripts).to.contain(plugScript);

						done();
					});

					it("update", function (done) {
						var plugScript = (plugPkg.scripts || {}).update;

						if (!plugScript) {
							return done();
						}

						var r = pkg.config.dirs.robyn;
						var p = robynPkg.config.dirs.plugins;
						plugScript = plugScript.replace(/^\./, path.join(r, p, plugPkg.name));

						var pkgScripts = pkg.scripts.update;

						expect(fs.existsSync(path.join(cwd, plugScript))).to.be.ok();
						expect(pkgScripts).to.contain(plugScript);

						done();
					});
				});

				var scope = (plugPkg.config || {}).scope;

				if (scope) {
					it("scope", function (done) {
						var scopePath = path.join(cwd, scope);
						expect(fs.existsSync(scopePath)).to.be.ok();

						done();
					});
				}
			});

		}
	});
});
