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
				// leave css and scripts content, allowing modules to add files directly here
                src: [
                    '.tmp',
                    '<%= config.dist %>/*',
                    '!<%= config.dist %>/.git*',
                    '!<%= config.dist %>/system/**',
                    '<%= config.dist %>/system/*',
                    '!<%= config.dist %>/system/assets/**',
                    '<%= config.dist %>/system/assets/*',
                    '!<%= config.dist %>/system/assets/css/**',
                    '!<%= config.dist %>/system/assets/scripts/**',
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
                dest: '<%= config.dist %>',
                src: [
				    // ignore all images (unless we really need some)
					//'system/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    //'system/assets/less/**/*',
                    //'system/assets/scripts/theme-customiser.js',
                    'system/assets/scripts/PIE.htc',
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
        //html: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/system/assets/css/**/*.css'],
        options: {
            dirs: ['<%= config.dist %>']
        }
    },
    cssmin: {
        dist: {
			css: {
				src: '<%= config.dist %>/system/assets/css/main.css',
				dest: '<%= config.dist %>/system/assets/css/main.css'
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
    'cssmin',
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