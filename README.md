RED Boilerplate
==========================================================================================

RED Interactive's boilerplate to initialize common projects.


Features
========

- Modular hierarchy.
- Auto-renaming of project variables.
- Support for both Django-based and static-based projects.


Requirements
============

- node 0.8.4+
	- `brew update && brew upgrade node`
- npm 1.1.45+
	- `npm update npm -g`
- grunt 0.3.11+
	- `npm install grunt -g`


How to use
==========

Creating a project
------------------

### Using the rbp NPM module

    npm install rbp -g
    rbp new sampleProjectName

### Standalone

    git clone https://github.com/ff0000/red-boilerplate.git
    grunt start

Cloning a project
------------------

If the project you are working on is using red-boilerplate, you still have to run `grunt start` to download all necessary dependencies (they are not checked into the repo).

    git clone https://github.com/ff0000/project-name.git
    grunt start

### Usage

Run `grunt --help` for a list of available tasks.

### grunt start

Initialize the project. This is required before running any other task. The task will ask for:

- Your project's title
- Your project's namespace
- A list of available plugins to install

### grunt install

Install a plugin after project initialization. Use via `grunt install:plugin`

### grunt build

Builds your project. Functionality varies based on installed plugins.

### grunt watch

Watch your project for file changes. Functionality varies based on installed plugins.

Available plugins
-----------------

- [__Caboose__](https://github.com/ff0000/red-boilerplate/tree/plugins/caboose) - RED Interactive's internal SASS + Compass framework
- [__JSHint__](https://github.com/ff0000/red-boilerplate/tree/plugins/jshint) - Lint your JavaScript with JSLint
- [__RED Start__](https://github.com/ff0000/red-boilerplate/tree/plugins/red-start) - Easy creation of Django projects and applications based the layout used at RED Interactive Agency.
- [__Rosy__](https://github.com/ff0000/red-boilerplate/tree/plugins/rosy) - An inheritable / extendable JavaScript framework.
- [__Statix__](https://github.com/ff0000/red-boilerplate/tree/plugins/statix) - Statix is a static website generator.


Creating a plugin
-----------------

You must create a plugin branch in order to add a plugin to RBP. The plugin branch contains a required `package.json` file, along with any RBP-specific files that are not part of your plugin's git repository.

Note that you do not have to target a git repository. Plugins can be self-contained within the plugin branch itself. It's an option you should use if it makes more semantic sense than creating a new git repository.

Check out this repository, then:

    git checkout --orphan plugins/sample-plugin-name
    git rm -rf .

### package.json

Each plugin must include its own `package.json` file. RBP will read through the parameters and perform the appropriate steps to import the plugin. For reference, take a look at Caboose's [`package.json`](https://github.com/ff0000/red-boilerplate/blob/plugins/caboose/package.json).

### common parameters

- `repository` (optional): An object containing the repo type, the target branch and the repo url.
- `dependencies` (optional): An object containing any `npm` dependencies.
- `scripts.install` (optional): A parameter containing any scripts to run on plugin install
- `config.scope` (optional): A parameter to scope your plugin to a specified directory.


Changelog
==========

2.7.3
------------------
- Adding hook for new Caboose 2.0 functionality.

2.7.2
------------------
- Fixed syntax issue in README.
- Fail when receiving an error while checking executable version.
- Strip @x.x.x from plugin name when checking for available plugins.

2.7.1
------------------
- Adding a proper changelog.
- Adding `grunt bump` to help when cutting project releases.
- Save warnings to `resources/config/local.json` instead of `package.json`
- Ensure newlines at end of JSON files.

2.7.0
------------------
- This release focuses on making RED Boilerplate organization agnostic. RED Boilerplate will continue to make it easier for other organizations to customize it for their respective users.
- A note on this release: It introduces functionality to run some cleanup tasks on update. Due to the nature of this functionality, `grunt update` will need to be run twice in succession on the initial update.

2.6.0
------------------
- Adding a local.json file to help detect if `grunt start` was run locally.
- When running `grunt build`, `grunt start` is only run when necessary.
- grunt.helper("check_initialized") now also detects if `grunt start` was run locally.
- Plugins have access to a config array of required directory paths.

2.5.7
------------------
- Remove grunt as a local dependency
- Add a config.ignoreTasks array of tasks to ignore.
- Don't delete grunt tasks, instead filter out of `grunt tasks` using config.ignoreTasks

2.5.6
------------------
- Fixed a bug where `grunt install` attempts to pull from current project repo.

2.5.5
------------------
- Removed padding from tasks table output.

2.5.4
------------------
- Add default system dependencies to package.json
- Relax validation on prompts, accept default Y or N values without requiring an input.
- `grunt start` now takes an optional parameter. `grunt start:master:kitchensink` will bypass most prompts and install all plugins by default.

2.5.3
------------------
- Replaced console.log with grunt.log.writeln
- Fixed a bug where `npm install` sometimes skipped random modules by listing out all modules to install. This had the added benefit of severely cutting down install time.
- Remove extra name parameter in installed_plugins object.
- Fixed a bug where detecting initialize script may sometimes error out.
- Fixed a bug where detecting plugin package.json files may error out.
- Re-add some excluded directories to resolve a bug in the initial `grunt start` task.
- If `grunt start` is interrupted, don't re-prompt any modules marked as installed.
- Don't mark modules as installed until the end of the install process.

2.5.2
------------------
- Drastically improve installation time by limiting variable replacement scope.
- Re-add Grunt as a dependency. It's the only way (for now) to remove default tasks from the tasks list.

2.5.1
------------------
- Fix issues with relative paths.

2.5.0
------------------
- .gitignore
    - Ignore `project/static/css/**/*.css` files
    - Ignore `project/static/js/**/*.min.js` files

- grunt.js
    - Remove superfluous {##} wrappers in metadata

- package.json
    - Remove grunt as a dependency, since RED Boilerplate doesn't depend on a specific version.

- resources/tasks/helpers/check-dependencies.js
    - Updating helper to take multiple dependencies

- resources/tasks/helpers/install-plugin.js
    - Instead of spawning new processes for plugin installation, require each plugin initializer and report any errors.
    - Save system dependencies to package.json for later use.
    - Concatenate system dependencies to avoid duplicates.
    - Don't use scripts.install, use scripts.initialize to allow for dependency checks before attempting each install.

- resources/tasks/helpers/install-plugin.js
    - Instead of spawning new processes for plugin installation, require each plugin initializer and report any errors.
    - Check system dependencies on `grunt start` before attempting to continue.

2.4.1
------------------
- Stop overwriting dependency warnings.
- Fix warning color output.

2.4.0
------------------
- Save dependency warnings to `package.json`.
- Prettify output.
- When possible, grab the package name / description / version from the incoming plugin's git repository.
