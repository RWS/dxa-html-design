/*
 * Grunt build from Page Template
 * Outputs only assets and no html
 */

'use strict';

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

    assemble: {
      options: {
        flatten: true,
        assets: '<%= config.dist %>/system/assets',
        layout: '<%= config.src %>/templates/layouts/default.hbs',
        data: '<%= config.src %>/data/*.{json,yml}',
        partials: '<%= config.src %>/templates/partials/**/*.hbs',
        files: {
          '.tmp/': [
            '<%= config.src %>/templates/pages/index.hbs'
          ]
        }
      },
      dist:{
        cwd: '<%= config.src %>/templates/pages/',
        expand: true,
        src: 'index.hbs',
        dest: '<%= config.dist %>/'
      },
    },

    less: {
      dist: {
        options: {
          cleancss: true,
          modifyVars: {
          }
        },
        files: {
          ".tmp/system/assets/css/main.css": "<%= config.src %>/system/assets/less/main.less",
          ".tmp/system/assets/css/icons.css": "<%= config.src %>/system/assets/less/icons.less",
          ".tmp/system/assets/css/bootstrap-select.css": "<%= config.src %>/system/assets/less/bootstrap-select.less"
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
		// delete generated (example) html page
		html: {
			files: [{
                dot: true,
                src: '<%= config.dist %>/*.html'
            }]
		}
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
                dest: '<%= config.dist %>/system/',
                src: [
				    // ignore all images (unless we really need some)
                    //'/assets/images/**/*.{webp,gif}',
					'/assets/images/wait-spinner.gif',
                    '/assets/fonts/*',
                    '/assets/less/**/*',
                    '/assets/scripts/PIE.htc',
                    '/assets/scripts/theme-customiser.js',
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
		// backup/copy generated (example) page to .tmp folder
		html: {
			files: [{
                expand: true,
                src: '<%= config.dist %>/*.html',
                dest: '.tmp/',
				filter: 'isFile'
            }]
		}
    },
	
    useminPrepare: {
        html: '<%= config.dist %>/index.html',
        options: {
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
	imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= config.src %>/system/assets/images',
                src: 'wait-spinner.gif',
                dest: '<%= config.dist %>/system/assets/images'
            }]
        }
    },
    cssmin: {
        dist: {
            files: {
                '<%= config.dist %>/system/assets/css/main.css': [
                    '.tmp/css/**/*.css',
                    '<%= config.src %>/css/**/*.css'
                ]
            }
        }
    }
  });

  grunt.loadNpmTasks('assemble');

  grunt.registerTask('build', [
    'clean:dist',
    'assemble:dist',
    'less:dist',
    'useminPrepare',
    'concat',
	'imagemin',
    'uglify',
    'copy',
    'usemin',
	'copy:html',
	'clean:html'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
  
  // remove colors from output
  grunt.option('color', false);
};