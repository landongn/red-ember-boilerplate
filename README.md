Robyn
=====

A highly customizable bootstrapper to initialize common projects. Robyn allows you to create a project boilerplate tailored to your specific requirements.

Robyn is highly extendable. It provides the bare essentials for you, but it is meant to be forked and extended based on your organization's needs.


Installing Robyn
================

### Requirements

- [`node`](http://nodejs.org) `>= 0.8.4`
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


Changelog
==========

1.0.0
------------------
- Initial release
