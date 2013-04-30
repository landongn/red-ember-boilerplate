Robyn
=====

A highly customizable bootstrapper to initialize common projects. Robyn allows you to create a project boilerplate tailored to your specific requirements.

Robyn is highly extendable. It provides the bare essentials for you, but it is meant to be forked and extended based on your organization's needs.

[![Build Status](https://secure.travis-ci.org/ff0000/robyn.png?branch=master,develop)](http://travis-ci.org/ff0000/robyn)


Installing Robyn
================

### Requirements

- [`node`](http://nodejs.org) `>= 0.9.x`
- [`npm`](http://nodejs.org) `>= 1.1.45`
- [`grunt`](http://gruntjs.com) `~ 0.3.x`

### Install the Robyn CLI

```bash
npm install robyn -g
```


How to use
==========

Creating a project
------------------

### Add your first boilerplate

Use the Robyn CLI to name your boilerplate and add a path to its git repository:

```bash
robyn add <name> <url>
robyn init <name> path/to/folder
```

Here's an example using RED Interactive's customized boilerplate:

```bash
robyn add rbp https://github.com/ff0000/red-boilerplate.git
robyn init rbp my-first-project
```


Cloning a project
------------------

For each of your robyn projects, you will need to run `grunt start` to download all necessary dependencies. The reference to your boilerplate is kept in a git submodule. Use the `--recursive` flag to clone the project and the robyn submodule at the same time.

Note that `grunt start` is automatically invoked when `robyn init` is run, so this step is not needed when creating a project. See below for the proper post-creation initializing method.

### Cloning your project and submodules

```bash
git clone https://github.com/ff0000/red-boilerplate.git --recursive
grunt start
```


Inside Robyn Projects
=====================

Run `grunt tasks` for a list of available tasks. The following are the built-in Robyn tasks. You should feel free to add more tasks per your needs.

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


Customizing Robyn
=================

Robyn comes with a plugin architecture that allows you to extend your bootstrap with optional additions. For example, you could use plugins to add Modernizr support, or to add JSHint support.

Starting your Bootstrap
-----------------------

```bash
robyn bootstrap path/to/folder
```

You'll be prompted to fill in some details for your bootstrap. It is recommended that you have a git url for your repository-to-be ahead of time, but you can always add that later.

Now you have a base robyn bootstrap. Here's how it looks:

```bash
README.md
package.json
config/
    __PLUGIN__
    local-default.json
defaults/
    .editorconfig
    .gitignore
    README.md
    grunt.js
    package.json
    robyn.json
plugins/
    .gitkeep
tasks/
    build.js
    default.js
    info.js
    install.js
    plugins.js
    start.js
    update.js
    helpers/
        check-dependencies.js
        check-for-plugins.js
        check-initialized.js
        get-assertion.js
        install-plugin.js
        replacer.js
        store-vars.js
    utils/
        local-pkg.js
        on-update.js
        pkg.js
```

An explanation of each directory is below:

### root
All root files are specific to the master robyn repo. It is not recommended that you modify these files.

### config
Pristine configuration files utilized by robyn. It is not recommended that you modify these files.

### defaults
The `defaults` directory contains your bootstrap's root-level files. All files contained in this directory will be copied to your bootstrap's parent directory.

This is where you should add your organization's skeleton files, global project files, tailored configuration options, etc. Anything that should be included by default. Treat this folder as your eventual project's root.

### plugins
Plugins are optional, installable modules that you can bundle along with your bootstrap. They're meant to extend the functionality of your bootstrap with additional tasks and project-specific methods.

Use `robyn plugin` to create your own plugins.

### tasks
A set of pre-defined tasks for your project management. You should feel free to add your own tasks. These can be seen in your project via the `grunt tasks` command.

See above for a list of built-in tasks.


Custom Build Tags
=====================

In order to keep major/minor/patch versions synced with Robyn, you should use the following format to tag your custom bootstrap releases:

`major.minor.patch-build`

For instance:

```bash
git tag -a "1.0.0-12" -m "Adding custom functionality"
```


Adding Custom Plugins
=====================

Use the Robyn CLI to add a plugin to your boilerplate:

```bash
robyn add-plugin <path/to/boilerplate>
```

Here's an overview of the default plugin hierarchy:

```bash
plugin.json
README.md
config/
    init
        __PLUGIN__.js
defaults/
    .gitignore
tasks/
    __PLUGIN__.js
```

### config
A folder for your plugin-specific scripts. For use if you need to run functionality on plugin install or update. The location is entirely optional, and you can define it in the `scripts.install` / `scripts.update` parameter of your `plugin.json`.

### defaults
Like its parent, anything placed here will be copied to your project relative to the project's root directory.

### tasks
A folder for your plugin-specific Grunt tasks.

### plugin.json
A plugin-specific definition of your plugin's internals.
Most of these parameters follow [npm package.json](http://package.json.jit.su) conventions:

- name
- description
- version
- repository
- dependencies
- devDependencies
- scripts

The following are custom parameters specific to Robyn:

### systemDependencies

A hash containing key/pair mappings of system-wide dependencies and versions. Example below:

```json
"systemDependencies": {
    "grunt": ">=0.3.0",
    "ruby": ">=1.8.x",
    "python": "*"
}
```

### config
A hash containing key/pair parameters specific to your plugin. Accepted values are:

###### scope
The main entry point of your plugin. For example, RED Interactive's [`rosy`](https://github.com/ff0000/red-boilerplate/blob/master/plugins/rosy/plugin.json#L27) plugin is scoped to `project/source/js`, and its associated files are copied to that location.

###### replaceVars
A boolean. When `true`, Robyn will traverse through the plugin's files and replace instances of the placeholder values `__PROJECT_NAME__` and `__PROJECT_TITLE__`

###### requiredPaths
An array of required plugin paths. Robyn collects these paths and checks for their existence. If any path listed is not found, it is assumed the plugin is not installed, and Robyn attempts to run any action found in `scripts.install`. Example below:

```json
"requiredPaths": [
    ".bundle",
    ".git",
    ".requiredfolder"
]
```

###### excludedPaths
An array of paths to exclude during file traversal. Example below:

```json
"excludedPaths": [
    "env",
    ".sass-cache,
    ".hiddenfolder"
]
```


Changelog
==========

See [changelog](tree/master/changelog)
