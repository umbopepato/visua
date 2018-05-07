const gulp = require('gulp');
const typescript = require('gulp-typescript');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = typescript.createProject('tsconfig.json');

gulp.task('compile', function () {
    gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['compile'], function() {
    gulp.watch('src/**/*.ts', ['compile']);
});