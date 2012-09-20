# **DO NOT EDIT CSS FILES DIRECTLY!**

The style sheets in this directory are generated using SASS.
Modifying .css files directly will probably result in lost changes.
Use Compass + SASS to compile .scss files in resources/sass:

[Compass](http://compass-style.org/)

[SASS](http://sass-lang.com/)

## ABOUT:

Sass is an extension of CSS3, adding nested rules, variables, mixins, selector inheritance, and more. It’s translated to well-formatted, standard CSS using the command line tool or a web-framework plugin.

SCSS is a superset of CSS3, which means you can code completely in CSS3 if that is your comfort zone.

## INSTALLATION:

Compass and SASS are Ruby gems. Install instructions can be found here:

[Compass](http://compass-style.org/docs/)

[SASS](http://sass-lang.com/download.html)

If you have the bundler gem installed (you should), it's a simple command for both (Note: sudo may be required):

`bundle install --gemfile resources/tasks/config/Gemfile`

## USAGE:

Each .scss file is an eventual CSS file. All SASS files inside of `resources/compass` will be generated as individual .css files and will be exported to the `css` directory. There is one exception, however. Any .scss file that begins with an underscore will not be included in the output. This makes it possible to have partials which can be used to define parameters, global variables, etc.

There are a couple of methods available to convert the files into CSS:

### grunt compass tasks

`grunt compass:dev`
`grunt compass:prod`

### The watch task

`grunt watch:compass`

Using the `watch` task, Compass will automatically compile style sheets into css whenever they change, eliminating the need to run the `compile` command after each edit.
