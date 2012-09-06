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


### Using the rbp NPM module

    npm install rbp -g
    rbp new sampleProjectName


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
