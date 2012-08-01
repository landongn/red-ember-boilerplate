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

Check out this repository, then:

    git checkout --orphan plugins/sample-plugin-name
    git rm -rf .

That's it. Create your plugin, commit as normal, then push up to GitHub.
