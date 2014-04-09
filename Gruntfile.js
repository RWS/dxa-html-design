/*
 * Generated on 2014-02-28
 * generator-assemble v0.4.10
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

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
      // less: {
      //   files: ['<%= config.src %>/assets/less/**/*.less'],
      //   tasks: ['less:server']
      // },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '.tmp/**/*.html',
          //'.tmp/assets/css/**/*.css',
          //'<%= config.src %>/assets/less/**/*.less',
          '<%= config.src %>/assets/scripts/**/*.js',
          '<%= config.src %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
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
        assets: '<%= config.dist %>/assets',
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
        files: {
          ".tmp/assets/css/main.css": "<%= config.src %>/assets/less/main.less",
          ".tmp/assets/css/icons.css": "<%= config.src %>/assets/less/icons.less"
        }
      },
      dist: {
        options: {
          cleancss: true,
          modifyVars: {
            //imgPath: '"http://mycdn.com/path/to/images"',
            //bgColor: 'red'
          }
        },
        files: {
          ".tmp/assets/css/main.css": "<%= config.src %>/assets/less/main.less",
          ".tmp/assets/css/icons.css": "<%= config.src %>/assets/less/icons.less"
        }
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

    copy: {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: '<%= config.src %>',
                dest: '<%= config.dist %>',
                src: [
                    '*.{ico,txt}',
                    '.htaccess',
                    'assets/images/**/*.{webp,gif}',
                    'assets/fonts/*',
                    'assets/less/**/*',
                    'assets/scripts/PIE.htc',
                    'assets/scripts/theme-customiser.js',
                    'bower_components/bootstrap/less/**/*',
                    'bower_components/less.js/dist/less-1.7.0.min.js',
                    'bower_components/font-awesome/less/**/*'
                ]
            },
            {
                expand: true,
                dot: true,
                cwd: '<%= config.src %>/bower_components/font-awesome/fonts/',
                dest: '<%= config.dist %>/assets/fonts',
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
                dest: '.tmp/assets/fonts',
                src: [
                    '**'
                ]
            }]
        }
    },

    useminPrepare: {
        html: '<%= config.dist %>/index.html',
        options: {
            // where tranformed css/js is put
            dest: '<%= config.dist %>'
        }
    },
    usemin: {
        html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/assets/css/**/*.css'],
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
                cwd: '<%= config.src %>/assets/images',
                src: '**/*.{png,jpg,jpeg}',
                dest: '<%= config.dist %>/assets/images'
            }]
        }
    },
    svgmin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.src %>/assets/images',
                src: '{,*/}*.svg',
                dest: '<%= config.dist %>/assets/images'
            }]
        }
    },
    cssmin: {
        dist: {
            files: {
                '<%= config.dist %>/assets/css/main.css': [
                    '.tmp/css/**/*.css',
                    '<%= config.src %>/css/**/*.css'
                ]
            }
        }
    },
    rev: {
        dist: {
            files: {
                src: [
                    '<%= config.dist %>/assets/scripts/**/*.js',
                    '<%= config.dist %>/assets/css/**/*.css',
                    '<%= config.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp}',
                    '<%= config.dist %>/assets/fonts/**/*'
                ]
            }
        }
    }


  });

  grunt.loadNpmTasks('assemble');

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
    //'cssmin',
    'imagemin',
    'uglify',
    'copy',
    //'rev',
    'usemin',
    //'htmlmin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
