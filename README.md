Robyn
==========================================================================================

A highly customizable boilerplate to initialize common projects.


Features
========

- Modular hierarchy.
- Auto-renaming of project variables.


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

### Install the Robyn CLI

    npm install robyn -g

### Add your first boilerplate

    robyn add red-boilerplate https://github.com/ff0000/red-boilerplate.git
    robyn init path/to/folder

Cloning a project
------------------

If the project you are working on is using robyn, you will need to run `grunt start` to download all necessary dependencies (the reference to your boilerplate is kept in a submodule).

### Cloning your project and submodules

    git clone https://github.com/ff0000/project-name.git --recursive
    grunt start

### Cloning your project without submodules

    git clone https://github.com/ff0000/project-name.git
    git submodule update --init
    grunt start

### Usage

Run `grunt tasks` for a list of available tasks.

### grunt start

Initialize the project. This is required before running any other task. The task will ask for:

- Your project's title
- Your project's namespace
- A list of available plugins to install

### grunt info

Show information regarding your project.

### grunt install

Install a plugin after project initialization. Use via `grunt install:plugin`

### grunt build

Builds your project. Functionality varies based on installed plugins.

### grunt watch

Watch your project for file changes. Functionality varies based on installed plugins.

### grunt update

Update Robyn to your latest bootstrap.


Changelog
==========

1.0.0
------------------
- Initial release
