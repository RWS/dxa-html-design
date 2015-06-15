/*
 * Generated on 2014-02-28
 * generator-assemble v0.4.10
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

 // note: this file (and changes to it) will be ignored by the html design build in the cms
 
'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

var yeomanConfig = {
    src: 'src', 
    dist: 'dist'
};

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: yeomanConfig,

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/**/*.{md,hbs,yml,json}'],
        tasks: ['assemble']
      },
      less: {
        files: ['<%= config.src %>/system/assets/less/**/*.less'],
        tasks: ['less:server']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '.tmp/**/*.html',
          //'.tmp/assets/css/**/*.css',
          '<%= config.src %>/system/assets/less/**/*.less',
          '<%= config.src %>/system/assets/scripts/**/*.js',
          '<%= config.src %>/system/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
              return [
                  lrSnippet,
                  mountFolder(connect, '.tmp'),
                  //mountFolder(connect, yeomanConfig.dist),
                  mountFolder(connect, yeomanConfig.src)
              ];
          }
        }
      },
      dist: {
        options: {
            middleware: function (connect) {
                return [
                    mountFolder(connect, yeomanConfig.dist)
                ];
            }
        }
      }
    },

    assemble: {
      options: {
        flatten: true,
        assets: '<%= config.dist %>/system/assets',
        layout: '<%= config.src %>/templates/layouts/default.hbs',
        data: '<%= config.src %>/data/*.{json,yml}',
        partials: '<%= config.src %>/templates/partials/**/*.hbs',
        files: {
          '.tmp/': [
            '<%= config.src %>/templates/pages/*.hbs'
          ]
        }
      },
      server:{
        cwd: '<%= config.src %>/templates/pages/',
        expand: true,
        src: '**/*.hbs',
        dest: '.tmp/'
      },
      dist:{
        cwd: '<%= config.src %>/templates/pages/',
        expand: true,
        src: '**/*.hbs',
        dest: '<%= config.dist %>/'
      },
    },

    less: {
      server: {
        options: {
        },
        files: [{
			expand: true,
			cwd: '<%= config.src %>/system/assets/less',
			// compile each LESS component excluding those starting with an underscore
			src: ['*.less', '!_*.less'],
			dest: '.tmp/system/assets/css/',
			ext: '.css'
		}]
      },
      dist: {
        options: {
          cleancss: true,
          modifyVars: {
            //imgPath: '"http://mycdn.com/path/to/images"',
            //bgColor: 'red'
          }
        },
        files: [{
			expand: true,
			cwd: '<%= config.src %>/system/assets/less',
			// compile each LESS component excluding those starting with an underscore
			src: ['*.less', '!_*.less'],
			dest: '.tmp/system/assets/css/',
			ext: '.css'
		}]
      }
    },

    clean: {
        dist: {
            files: [{
                dot: true,
                src: [
                    '.tmp',
                    '<%= config.dist %>/*',
                    '!<%= config.dist %>/.git*',
                ]
            }]
        },
        server: '.tmp'
    },

    uglify: {
      options: {
        compress: {
          negate_iife: false,
          drop_console: true
        }
      }
    },

    copy: {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.src %>',
                dest: '<%= config.dist %>',
                src: [
                    //'system/assets/less/**/*',
                    //'system/assets/scripts/theme-customiser.js'
                    //'bower_components/bootstrap/less/**/*',
                    //'bower_components/less.js/dist/less-1.7.0.min.js',
                    //'bower_components/font-awesome/less/**/*'
                    'system/assets/scripts/PIE.htc',
                    'system/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'system/assets/fonts/*'
                ]
            },
            {
                expand: true,
                dot: true,
                cwd: '<%= config.src %>',
                dest: '<%= config.dist %>/',
                src: [
                    '*.{ico,txt}',
                    '.htaccess'
                ]
            },
            {
                expand: true,
                dot: true,
                cwd: '<%= config.src %>/bower_components/font-awesome/fonts/',
                dest: '<%= config.dist %>/system/assets/fonts',
                src: [
                    '**'
                ]
            }]
        },
        server: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.src %>/bower_components/font-awesome/fonts/',
                dest: '.tmp/system/assets/fonts',
                src: [
                    '**'
                ]
            }]
        }
    },

    useminPrepare: {
        html: '<%= config.dist %>/*.html',
        options: {
            // where tranformed css/js is put
            dest: '<%= config.dist %>'
        }
    },
    usemin: {
        html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/system/assets/css/**/*.css'],
        options: {
            dirs: ['<%= config.dist %>']
        }
    },
    // htmlmin: {
    //   dist: {
    //     options: {
    //     },
    //     files: [{
    //       expand: true,
    //       cwd: '.tmp',
    //       src: '*.html',
    //       dest: '<%= config.dist %>'
    //     }]
    //   }
    // },
    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.src %>/system/assets/images',
                src: '*.{png,jpg,jpeg,gif}',
                dest: '<%= config.dist %>/system/assets/images'
            }]
        }
    },
    svgmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.src %>/system/assets/images',
                src: '{,*/}*.svg',
                dest: '<%= config.dist %>/system/assets/images'
            }]
        }
    },
    cssmin: {
        dist: {
            //files: {
            //    '<%= config.dist %>/system/assets/css/main.css': [
            //        '.tmp/css/**/*.css',
            //        '<%= config.src %>/css/**/*.css'
            //    ]
            //}
			css: {
				src: '<%= config.dist %>/system/assets/css/main.css',
				dest: '<%= config.dist %>/system/assets/css/main.css'
			}
        }
    },
    rev: {
        dist: {
            files: {
                src: [
                    '<%= config.dist %>/system/assets/scripts/**/*.js',
                    '<%= config.dist %>/system/assets/css/**/*.css',
                    '<%= config.dist %>/system/assets/images/**/*.{png,jpg,jpeg,gif,webp}',
                    '<%= config.dist %>/system/assets/fonts/**/*'
                ]
            }
        }
    },
    validation: {
        options: {
            reset: grunt.option('reset') || false,
			//serverUrl: 'http://10.100.101.193/w3c-validator/check',
			//serverUrl: 'https://validator.w3.org/nu/',
            relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.',
			             'This interface to HTML5 document checking is deprecated.'] //ignores these errors
        },
        files: {
            src: [//'<%= config.dist %>/ajax/*.html',
				  '<%= config.dist %>/beta/*.html',
				  '<%= config.dist %>/content-types/*.html',
				  '<%= config.dist %>/features/*.html',
				  '<%= config.dist %>/layouts/*.html',
				  '<%= config.dist %>/lists/*.html',
				  '<%= config.dist %>/*.html']
        }
    },
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-html-validation');

  grunt.registerTask('serve', function(target){
    if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    if (target === 'less') {
        return grunt.task.run(['lessbuild', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'assemble:server',
      'less:server',
      'copy:server',
      'connect:livereload',
      'watch'
    ]);

  });

  grunt.registerTask('lessbuild', [
    'clean:dist',
    'assemble:dist',
    'less:dist',
    //'htmlmin',
    'useminPrepare',
    'concat',
    //'cssmin',
    //'imagemin',
    //'uglify',
    'copy',
    //'rev',
    'usemin',
    //'htmlmin'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'assemble:dist',
    'less:dist',
    //'htmlmin',
    'useminPrepare',
    'concat',
    'cssmin',
    'imagemin',
    'uglify',
    'copy',
    //'rev',
    'usemin',
    //'htmlmin',
    'validation'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};