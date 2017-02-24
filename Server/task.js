var gulp = require('gulp');
var concat = require('gulp-concat')
var spawn = require('child_process').spawn;
var livereload = require('gulp-livereload');


var gulpActivity = function(app, http) {

	this.app = app;
	this.http = http;

	var libs_js = [
	               'ui/node_modules/angular/angular.min.js', 'ui/libs/socket.io/socket.io.min.js', 
	               'ui/node_modules/angular-ui-router/release/angular-ui-router.min.js'
	               ];
	var ui_files = ['ui/'];
	var ui_js = [
	               'ui/*.js',  
	               'ui/app/services/*.js',
	               'ui/app/directives/*.js',
	               'ui/app/admin/ctrl/*.js',
	               'ui/app/push/*.js'
	            ];

	var server_app = ['application/admin/*.js'];

	this.start = function(port) {

		console.log("called gulp")

		

		gulp.task('connect', function() {
				   http.listen(port, function(){
				   console.log('listening on :' + port);
				});
		});

		gulp.task('build_libs_js', function() {
			return gulp.src(libs_js)
			         .pipe(concat('scripts_libs.js'))
			         .pipe(gulp.dest('ui/build'));
		})

		gulp.task('build_js', function() {
			console.log("building js")
			return gulp.src(ui_js)
			         .pipe(concat('scripts.js'))
			         .pipe(gulp.dest('ui/build'));
		})

		gulp.task('build_final_js', function() {
			return gulp.src(['ui/build/scripts_libs.js', 'ui/build/scripts.js'])
			         .pipe(concat('script.js'))
			         .pipe(gulp.dest('ui/build'));
		})

		gulp.task('watch', function(event) {
			//livereload.listen();
			gulp.watch(['ui/*'], ['build_js']);
			gulp.watch(ui_js, ['build_js']);
			gulp.watch(server_app, ['gulp-autoreload']);
		})

      
       gulp.task('gulp-autoreload', function() {
			spawn('gulp', ['default'], {stdio: 'inherit'});
            process.exit();
      });



		gulp.task('default', ['connect', 'build_libs_js', 'build_js', 'watch']);


	}
	
}
module.exports = gulpActivity;

