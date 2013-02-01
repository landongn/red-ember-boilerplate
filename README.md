RED Boilerplate
==========================

RED Interactive's custom Robyn boilerplate.

[![Build Status](https://secure.travis-ci.org/ff0000/red-boilerplate.png?branch=master,develop)](http://travis-ci.org/ff0000/red-boilerplate)


Installing Robyn
================

### Requirements

- [`robyn`](http://github.com/ff0000/robyn) `>= 1.0.0`

### Install the Robyn CLI

```bash
npm install robyn -g
robyn add rbp git://github.com/ff0000/red-boilerplate.git
```

How to use
==========

### Creating a project

```bash
robyn init rbp path/to/folder
```

### Custom parameters

You can add custom parameters along with your bootstrap definition. For example, the following stores a version of RED Boilerplate that only includes the `red-start` plugin:

```bash
robyn add rbp-backend git://github.com/ff0000/red-boilerplate.git --include-plugins red-start
robyn init rbp-backend path/to/folder
```

This command includes all plugins:

```bash
robyn add rbp-all git://github.com/ff0000/red-boilerplate.git --all
robyn init rbp-all path/to/folder
```

While this command includes no plugins:

```bash
robyn add rbp-bare git://github.com/ff0000/red-boilerplate.git --bare
robyn init rbp-bare path/to/folder
```
