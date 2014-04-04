module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-nodemon');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		nodemon: {
			dev: {
				script: './server.js',
				options: {
					nodeArgs: ['--harmony'],
					ext: 'js,jade',
					ignore: ['node_modules/**', 'gruntfile.js'],

					// delay: 1,
					env: {
						PORT: '31415',
						NODE_ENV: 'development'
					},
					cwd: __dirname,
				}
			}
		},
	});



	// grunt.registerTask('minify', ['cssmin:css', 'browserify2:appJs', 'uglify:appJs']);
	grunt.registerTask('default', ['nodemon']);
};