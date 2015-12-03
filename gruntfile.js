'use strict';

module.exports = function (grunt) {

    var requirejsOptions = (function () {
        var excluded = ['jquery', 'underscore', 'easyDropDown', 'jqueryRest',
            'jqueryJson', 'jqueryForm', 'datepicker', 'layer',
            'datatables', 'audiojs', 'highcharts', 'highcharts-theme',
            'validator', 'lazyLoad', 'fullcalendar',
            'fullcalendar-zh', 'moment', 'jtip', 'ueditor',
            'qiniu', 'plupload', 'lightbox', 'darktooltip'];

        var fs = require('fs');
        var regx = new RegExp('.*\.js$');
        var walk = function (path, modules) {
            fs.readdirSync(path).forEach(function (file) {
                if (regx.test(file)) {
                    modules.push(path + '/' + file);
                } else {
                    walk(path + '/' + file, modules);
                }
            });
        };
        var jsFiles = [],
            modules = [],
            commonRegx = new RegExp('.*/common/.*'),
            pathRegx = new RegExp('^public/js/(.*)\.js$');
        walk('public/js/app', jsFiles);
        for (var i = 0; i < jsFiles.length; i++) {
            var file = jsFiles[i];
            if (commonRegx.test(file)) {
                continue;
            }

            modules.push({
                name: pathRegx.exec(file)[1],
                exclude: excluded
            });
        }

        return {
            appDir: 'public',
            baseUrl: 'js',
            dir: '.tmp',
            mainConfigFile: 'public/js/buildConfig.js',
            optimizeCss: "standard",
            modules: modules
        }
    })();


    // Unified Watch Object
    var watchFiles = {
        serverViews: ['app/views/**/*.*'],
        serverJS: ['gruntfile.js', 'server.js',
            'config/**/*.js', 'app/**/*.js']
    };

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            beforeBuild: ['build', '.tmp'],
            afterBuild: '.tmp',
            release: 'build'
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['**/*.*'],
                        dest: 'build/app'
                    },
                    {
                        expand: true,
                        cwd: 'db/',
                        src: ['**/*.*'],
                        dest: 'build/db'
                    },

                    {
                        expand: true,
                        cwd: 'config/',
                        src: ['**/*.*'],
                        dest: 'build/config'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['server.js', 'package.json', 'process.json'],
                        dest: 'build/',
                        filter: 'isFile'
                    }
                ]
            },
            srcHtmls: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/views',
                        src: ['**/*.*'],
                        dest: '.tmp/views'
                    }
                ]
            },
            srcConfig: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['public/js/config.js'],
                        dest: '.tmp/js',
                        filter: 'isFile'
                    }
                ]
            },
            minCss: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['.tmp/css/layout*.css'],
                        dest: 'build/public/css'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['.tmp/css/login*.css'],
                        dest: 'build/public/css'
                    }
                ]
            },
            minJs: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/js',
                        src: ['**/*.*', '!**/common/*'],
                        dest: 'build/public/js'
                    }
                ]
            },
            updatedHtmls: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/views',
                        src: ['**/*.*'],
                        dest: 'build/app/views'
                    }
                ]
            },
            sounds: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/sounds',
                        src: ['**/*.*'],
                        dest: 'build/public/sounds'
                    }
                ]
            },
            swf: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/swf',
                        src: ['**/*.*'],
                        dest: 'build/public/swf'
                    }
                ]
            },
            updatedImages: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        src: ['**/*.*'],
                        dest: 'build/public/images'
                    }
                ]
            }

        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        src: ['**/*.{png,jpg,jpeg,gif,svg}'],
                        dest: 'build/public/images'
                    }
                ]
            }
        },
        watch: {
            serverViews: {
                files: watchFiles.serverViews,
                options: {
                    livereload: true
                }
            },
            serverJS: {
                files: watchFiles.serverJS,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: watchFiles.serverJS,
                options: {
                    jshintrc: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    //nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: watchFiles.serverViews.concat(watchFiles.serverJS)
                }
            }
        },
        concurrent: {
            default: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true,
                limit: 10
            }
        },
        requirejs: {
            compile: {
                options: requirejsOptions
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            source: {
                files: [{
                    src: [
                        '.tmp/css/**/*',
                        '.tmp/js/app/**/*',
                        '.tmp/js/config.js'
                    ]
                }]
            }
        },
        filerev_replace: {
            options: {
                assets_root: '.tmp/images/**/*'
            },
            compiled_assets: {
                src: '.tmp/**/*.{css,js}'
            },
            views: {
                options: {
                    views_root: '.tmp/views/'
                },
                src: '.tmp/views/**/*.html'
            }
        }

    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    grunt.registerTask('build', function () {
        grunt.task.run(['clean:beforeBuild',
            'copy:main',
            'requirejs',
            'copy:srcHtmls',
            'copy:srcConfig',
            'copy:minCss',
            'copy:minJs',
            'copy:updatedHtmls',
            'copy:sounds',
            'copy:swf',
            'copy:updatedImages',
            'clean:afterBuild'
        ]);
    });

    //grunt.registerTask('default', ['lint', 'concurrent:default']);

    //grunt.registerTask('lint', ['jshint']);


};
