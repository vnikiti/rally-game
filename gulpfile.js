var gulp = require('gulp'), 
    connect = require('gulp-connect'), 
    livereload = require('gulp-livereload'), 
    watch = require('gulp-watch');

gulp.task('webserver', function() {
    connect.server();
});

gulp.task('livereload', function() {
    connect.reload();
    livereload.reload();
});

gulp.task('watch', function() {
    connect.server();
    livereload.listen();
    gulp.watch('src/**/*.js', [ 'livereload' ]);
});

gulp.task('default', [ 'webserver' ]);