RED Boilerplate
==========================

RED Interactive's custom Robyn boilerplate.

[![Build Status](https://secure.travis-ci.org/ff0000/red-boilerplate.png?branch=master,develop)](http://travis-ci.org/ff0000/red-boilerplate)


Installing Robyn
================

### Requirements

- [`robyn`](http://github.com/ff0000/robyn) `>= 1.0.0`

### Install the Robyn CLI

```shell
npm install robyn -g
robyn add rbp git://github.com/ff0000/red-boilerplate.git
```

How to use
==========

### Creating a project

```shell
robyn init rbp path/to/folder
```

### Custom parameters

You can add custom parameters along with your bootstrap definition. For example, the following stores a version of RED Boilerplate that only includes the `red-start` plugin:

```shell
robyn add rbp-backend git://github.com/ff0000/red-boilerplate.git --include-plugins red-start
robyn init rbp-backend path/to/folder
```

This command includes all plugins:

```shell
robyn add rbp-all git://github.com/ff0000/red-boilerplate.git --all
robyn init rbp-all path/to/folder
```

While this command includes no plugins:

```shell
robyn add rbp-bare git://github.com/ff0000/red-boilerplate.git --bare
robyn init rbp-bare path/to/folder
```

Built-in Tasks
==========
Run any of the following via `grunt [task]`:

### Build
Builds your current project.

### Tasks
List out your project's available tasks.

### Info
Outputs project specific information, such as your current Robyn version, etc.

### Install/Uninstall
Find plugins to install/uninstall.

### Start
Initialize your project's boilerplate.

### Sync
Sync your Robyn version with any upstream changes.

### Update
Update your boilerplate to the latest RBP version.

Plugins
==========

### [Caboose](https://github.com/ff0000/caboose)
Caboose is RED's Sass framework. Built on top of Compass, it provides additional mixins and features to aid in writing Sass.

The plugin installs Caboose to your `project/source/scss` directory and installs your project's Ruby gem bundle.

#### Tasks
- `caboose`

#### Build Task
`grunt build` will run `compass clean` and `compass compile` to ensure the build process compiles the latest Sass files.

#### Watch Task
`grunt watch` watches your project for Sass changes and compiles Sass accordingly. LiveReload will refresh your page on Sass change.

### [RED Start](https://github.com/ff0000/red-start)
RED Start allows the easy creation of Django projects and applications based the layout used at RED Interactive Agency.

The plugin adds RED Start on top of RBP and provides some additional functionality for front-end development.

#### Tasks
- `server`

#### Server Task
`grunt server` spins up Django's runserver. For additional convenience it will also run `grunt watch` automatically.

### [Rosy](https://github.com/ff0000/rosy)
RED's inhertiable AMD framework.

#### Tasks
- `jshint`
- `modernizr`
- `requirejs`
- `rosy`

#### Build Task
`grunt build` will compile your project via r.js, verify your code via JSHint, and automatically build out a custom Modernizr based on your usage. It will also minify your RequireJS instance for production use.

#### Watch Task
`grunt watch` watches your project for JavaScript changes. LiveReload will refresh your page on JS change.

### [Scarlet](https://github.com/ff0000/scarlet)
RED's custom CMS. The Scarlet plugin will install tools useful for development in Scarlet.

### [Statix](https://github.com/ff0000/statix)
Statix is used for developing static websites. It mimics Django's environment to provide parity with our official framework.

#### Tasks
- `statix:server`
- `statix:build`

#### Server Task
`grunt server` maps to `grunt statix:server` when RED Start is not installed. It runs a local node server.

#### Build Task
`grunt build` will compile your static files and export them to your `deploy` folder.

