module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concurrent: {
			dev: {
				tasks: ['nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},


		nodemon: {
			dev: {
				script: './server.js',
				options: {
					nodeArgs: ['--harmony'],
					ext: 'js,jade,json',
					ignore: ['node_modules/**', 'gruntfile.js'],

					// delay: 1,
					env: {
						PORT: '31415',
						NODE_ENV: 'development'
					},
					cwd: __dirname,
				}
			},
			prod: {
				script: './server.js',
				options: {
					nodeArgs: ['--harmony'],
					ext: 'js,jade,json',
					ignore: ['node_modules/**', 'gruntfile.js'],

					// delay: 1,
					env: {
						PORT: '31415',
						NODE_ENV: 'production'
					},
					cwd: __dirname,
				}
			}
		},


		watch: {
			templates: {
				files: [
					'./views/**/*.jade',
				],
				options: {
					livereload: true,
				},
			},


			lessApp: {
				files: [
					'./public/css/app.less'
				],
				tasks: ['less:app'],
				options: {
					livereload: false,
				},
			},


			cssApp: {
				files: [
					'./public/css/dist/app.css'
				],
				tasks: ['cssmin:app'],
				options: {
					livereload: true,
				},
			},

			cssAppMin: {
				files: [
					'./public/css/dist/app.min.css'
				],
				options: {
					livereload: true,
				},
			},


			jsDev: {
				files: [
					'./public/js/*.js',
					'./public/js/jsx/**/*.*',
				],
				// tasks: ['uglify:appJs'],
				tasks: ['compile-js'],
				options: {
					livereload: false,
				},
			},

			jsProd: {
				files: [
					'./public/js/dist/*.min.js',
				],
				options: {
					livereload: true,
				},
			},
		},


		less: {
			app: {
				files: {
					"./public/css/dist/app.css":
						"./public/css/app.less"
				},
				options: {
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: './app.css.map',
					sourceMapFilename: './public/css/dist/app.css.map'
				}
			},
		},


		cssmin: {
			app: {
				files: {
					'public/css/dist/app.min.css': [
						'public/css/dist/app.css',
					]
				}
			}
		},



		browserify: {
			options: {
				transform: [require('grunt-react').browserify],
				ext: '.jsx',
			},
			app: {
				src: 'public/js/app.js',
				dest: 'public/js/dist/app.js',
			}
		},



		uglify: {
			options: {
				report: 'min',
				stripBanners: false,
				mangle: true,
				preserveComments: 'some',
			},
			app: {
				options: {
					sourceMap: true,
				},
				files: {
					'public/js/dist/app.min.js': [
						'public/js/dist/app.js',
					]
				}
			},
		},

	});



	grunt.registerTask('compile-css', ['less', 'cssmin']);
	grunt.registerTask('compile-js', ['browserify', 'uglify']);
	grunt.registerTask('compile', ['compile-css', 'compile-js']);

	grunt.registerTask('dev', ['compile', 'concurrent:dev']);
	grunt.registerTask('prod', ['compile', 'nodemon:prod']);

	grunt.registerTask('default', ['dev']);
};
