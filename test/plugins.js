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
				describe("plugin information", function () {
					it("should be a valid object", function () {
						expect(plugPkg).to.be.an("object");
					});

					it("plugin name", function () {
						expect(plugPkg.name).to.be.ok();
						expect(plugPkg.name).to.match(/^[a-z0-9]+/);
					});

					it("plugin description", function () {
						expect(plugPkg.description).to.be.ok();
					});

					if (plugPkg.version) {
						var semver = require("semver");

						it("semver versioning", function () {
							expect(semver.valid(plugPkg.version)).to.be.ok();
						});
					}
				});

				describe("plugin dependencies", function () {
					var plugDeps = plugPkg.dependencies || {};

					var keys = Object.keys(plugDeps);

					if (!keys.length) {
						return;
					}

					var nodeDir = path.join(cwd, "node_modules");

					it("npm packages directory", function (done) {
						expect(fs.existsSync(nodeDir)).to.be.ok();
						done();
					});

					keys.forEach(function (key) {
						it(key, function (done) {
							var npmModuleDir = path.join(nodeDir, key);
							expect(fs.existsSync(npmModuleDir)).to.be.ok();

							done();
						});
					});
				});

				describe("system dependencies", function () {
					var cp = require("child_process");

					var pkgDeps = pkg.systemDependencies;
					var plugDeps = plugPkg.systemDependencies;

					it("valid dependencies objects", function () {
						expect(pkgDeps).to.be.an("object");
						expect(plugDeps).to.be.an("object");
					});

					var doTest = function (key) {
						it(key, function (done) {
							expect(pkgDeps[key]).to.be.ok();
							expect(plugDeps[key]).to.eql(pkgDeps[key]);

							var child = cp.spawn(key, ["--version"], {
								stdio: "pipe"
							});

							var stdout = [];
							var stderr = [];

							child.stdout.on("data", function (data) {
								stdout.push(data.toString());
							});

							child.stderr.on("data", function (data) {
								stderr.push(data.toString());
							});

							child.on("exit", function () {
								var out = stdout.join("");
								var err = stderr.join("");

								expect(err).to.not.contain("No such file or directory");

								done();
							});
						});
					};

					for (var key in plugDeps) {
						doTest(key);
					}
				});

				var pkgReqPaths = (pkg.config || {}).requiredPaths;
				var plugReqPaths = (plugPkg.config || {}).requiredPaths;

				if (plugReqPaths) {
					describe("required paths", function () {
						plugReqPaths.forEach(function (req) {
							it(req, function (done) {
								expect(pkgReqPaths).to.contain(req);
								expect(fs.existsSync(path.join(cwd, req))).to.be.ok();

								done();
							});
						});
					});
				}

				var pkgExcPaths = (pkg.config || {}).excludedPaths;
				var plugExcPaths = (plugPkg.config || {}).excludedPaths;

				if (plugExcPaths) {
					describe("excluded paths", function () {
						plugExcPaths.forEach(function (req) {
							it(req, function (done) {
								expect(pkgExcPaths).to.contain(req);
								expect(fs.existsSync(path.join(cwd, req))).to.be.ok();

								done();
							});
						});
					});
				}

				describe("file structure", function () {
					globber.glob(path.join(filepath, "defaults", "**", "*"), {
						dot: true
					}).forEach(function (file) {
						var defaultsPath = path.join(plugPath, plugPkg.name, "defaults", "/");
						var cleanFile = file.replace(defaultsPath, "");
						var expectedFile = path.join(cwd, cleanFile);

						var exclude = [
							"package.json",
							".gitignore",
							"README.md"
						];

						if (exclude.indexOf(path.basename(cleanFile)) === -1) {
							it(cleanFile, function (done) {
								expect(fs.existsSync(expectedFile)).to.be.ok();
								done();
							});
						}
					});
				});

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
