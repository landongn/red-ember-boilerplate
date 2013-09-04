/* jshint node: true */
module.exports = function (grunt) {
    "use strict";
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    var LIVERELOAD_PORT = 35729;
    var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var path = require("path"),
        cwd = process.cwd(),
        projectConfig = {
            app: 'project',
            dist: 'dist'
        };
    // Project configuration.
    grunt.initConfig({
        project: projectConfig,
        watch: {
            emberTemplates: {
                files: '<%= project.app %>/templates/**/*.hbs',
                tasks: ['emberTemplates']
            },
            compass: {
                files: ['<%= project.app %>/css/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            neuter: {
                files: ['<%= project.app %>/js/{,*/}*.js'],
                tasks: ['neuter']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '.tmp/js/*.js',
                    '<%= project.app %>/*.html',
                    '{.tmp,<%= project.app %>}/css/{,*/}*.css',
                    '<%= project.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, projectConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, projectConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= project.dist %>/*',
                        '!<%= project.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= project.app %>/js/{,*/}*.js',
                '!<%= project.app %>/js/lib/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                require: 'zurb-foundation',
                sassDir: '<%= project.app %>/css',
                cssDir: '.tmp/css',
                generatedImagesDir: '.tmp/img/generated',
                imagesDir: '<%= project.app %>/img',
                javascriptsDir: '<%= project.app %>/js',
                fontsDir: '<%= project.app %>/css/fonts',
                importPath: '<%= project.app %>js/lib',
                httpImagesPath: '/img',
                httpGeneratedImagesPath: '/img/generated',
                httpFontsPath: '/css/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= project.dist %>/js/{,*/}*.js',
                        '<%= project.dist %>/css/{,*/}*.css',
                        '<%= project.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= project.dist %>/css/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= project.app %>/index.html',
            options: {
                dest: '<%= project.dist %>'
            }
        },
        usemin: {
            html: ['<%= project.dist %>/{,*/}*.html'],
            css: ['<%= project.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['<%= project.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= project.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= project.dist %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= project.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= project.dist %>/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= project.dist %>/css/main.css': [
                        '.tmp/css/{,*/}*.css',
                        '<%= project.app %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/project/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.app %>',
                    src: '*.html',
                    dest: '<%= project.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= project.app %>',
                    dest: '<%= project.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'img/{,*/}*.{webp,gif}',
                        'css/fonts/*'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'emberTemplates',
                'compass:server'
            ],
            test: [
                'emberTemplates',
                'compass'
            ],
            dist: [
                'emberTemplates',
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        emberTemplates: {
            options: {
                templateName: function (sourceFile) {
                    var templatePath = projectConfig.app + '/templates/';
                    return sourceFile.replace(templatePath, '');
                }
            },
            dist: {
                files: {
                    '.tmp/js/compiled-templates.js': '<%= project.app %>/templates/{,*/}*.hbs'
                }
            }
        },
        neuter: {
            app: {
                options: {
                    filepathTransform: function (filepath) {
                        return 'app/' + filepath;
                    }
                },
                src: '<%= project.app %>/js/app.js',
                dest: '.tmp/js/combined-scripts.js'
            }
        }
    });

    // Load grunt-contrib tasks
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Robin tasks
    // Load your custom tasks *after* these
    (function () {
        var fs = require("fs");

        var dir = path.join(cwd, ".robyn"),
            files = grunt.file.expand(path.join(dir, "*"));

        if (!files.length) {
            var d = dir.replace(cwd + path.sep, "");

            var warn = [
                "%s is not yet initialized".replace("%s", d),
                "Run `git submodule update --init .robyn`",
                "Then try this command again."
            ].join("\n       ").trim();

            grunt.fail.warn(warn);
        }

        var robynPkg = require(path.join(dir, "package.json")),
            tasks = path.join(dir, robynPkg.config.dirs.tasks);

        grunt.loadTasks(tasks);

        // Customize path in robyn.json
        var pkg = require(path.join(cwd, "robyn.json")),
            local = path.join(cwd, pkg.config.dirs.tasks);

        if (fs.existsSync(local)) {
            grunt.loadTasks(local);
        }
    }());

};
