'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        root: 'app/',
        build: 'app/build',
        source: 'app/source',
        srcAssets: 'app/source/assets',
        srcTemplates: 'app/source/templates',
        buildAssets: 'app/build/assets',

        // HTML template
        assemble: {
                options: {
                    assets: "assets",
                    partials: '<%= srcTemplates %>/partials/{,*/}*.hbs',
                    layoutdir: '<%= srcTemplates %>/layouts/',
                    flatten: true,
                    layout: 'default.hbs'
                },
                pages:{
                    options: {
                        layout: 'default.hbs'
                    },
                    files: {
                        '<%= build %>/': ['<%= srcTemplates %>/pages/*.hbs']
                    }
                }

        },

        // Grunt Compass Docs: https://github.com/gruntjs/grunt-contrib-sass
        sass: {
            dist: {
                options: {
                  style: 'compressed',
                  sourcemap: true
                },
                files: {
                  '<%= buildAssets %>/css/app.css': '<%= srcAssets %>/scss/app.scss',
                }
              }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                '<%= srcAssets %>/js/{,*/}*.js'
            ]
        },

        clean: {
            dist: {
                src: ['<%= build %>/**', '.tmp']
            },
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= srcAssets %>/',
                    src: ['img/**', 'fonts/**'],
                    dest: '<%= buildAssets %>/',
                    filter: 'isFile'
                }]
            },
        },

        concat: {
            compile: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: '\n/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n', // + '"use strict";\n'
                    process: function(src, filepath) {
                        return '\n// ********* Source: ' + filepath + ' ********* \n \n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                   
                    stripBanners: true
                },
                files: {
                    '<%= buildAssets %>/css/libs.css': [
                                                        '<%= srcAssets %>/scss/libs/bootstrap.min.css',
                                                    
                                                        ],
                    '<%= buildAssets %>/js/libs.js': [
                                                        '<%= srcAssets %>/js/libs/modernizr.js',
                                                        '<%= srcAssets %>/js/libs/respond.js',
                                                        '<%= srcAssets %>/js/libs/bootstrap.js'
                                                    ],
                    '<%= buildAssets %>/js/app.js':[
                                                        '<%= srcAssets %>/js/global.js',    
                                                    ]                                
                    
                }
            }
        },

        uglify: {
            publish: {
                options: {
                    mangle: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= buildAssets %>/js',
                    src: '**/*.js',
                    dest: '<%= buildAssets %>/js'
                }]
            }

        },

        connect: {
            server: {
                options: {
                    port: 9090,
                    base: '<%= build %>',
                    hostname: 'localhost',
                    livereload: true,
                    open: true
                }
            }
        },

        watch: {
            livereload: {
                files: ['Gruntfile.js', '<%= build %>/**', '<%= srcAssets %>/js/**/*.js'],
                options: {
                    livereload: true
                }
            },
            assemble: {
                files: '**/*.hbs',
                tasks: ['assemble']
            },
            grunt: {
                files: ['Gruntfile.js', '<%= srcAssets %>/js/**/*.js']
            },
            sass: {
                files: ['<%= srcAssets %>/scss/**/*.scss'],
                tasks: ['sass']
            },
            copy: {
                files: ['<%= srcAssets %>/img'],
                tasks: ['copy']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('build', ['clean', 'sass', 'assemble', 'concat', 'copy']);
    grunt.registerTask('default', ['server']);
    grunt.registerTask('validate-js', ['jshint']);

    grunt.registerTask('server', ['build', 'connect', 'watch']);

    grunt.registerTask('publish', 'run publish', function() {
        var task = grunt.option('target') || 'staging';

        if (task === 'debug') {
            grunt.task.run(['validate-js', 'build']);
        } else {
            grunt.task.run(['build', 'uglify']);
        }
    });
};