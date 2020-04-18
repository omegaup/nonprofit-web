const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const pkg = require('./package.json');

// Set the banner content
const banner = `/*!
 * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)
 * Copyright 2013-${new Date().getFullYear()} <%= pkg.author %>
 * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)
 */
`;

// Compile LESS files from /less into /css
const compileLess = () => {
  return gulp
    .src('less/creative.less')
    .pipe(less())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('css'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
};

// Minify compiled CSS
const minifyCss = () => {
  return gulp
    .src('css/creative.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
};

// Minify JS
const minifyJs = () => {
  return gulp
    .src('js/creative.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
};

// Copy vendor libraries from /node_modules into /vendor
const copy = cb => {
  gulp
    .src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map',
    ])
    .pipe(gulp.dest('vendor/bootstrap'));

  gulp
    .src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery/dist/jquery.min.js',
    ])
    .pipe(gulp.dest('vendor/jquery'));

  gulp
    .src(['node_modules/magnific-popup/dist/*'])
    .pipe(gulp.dest('vendor/magnific-popup'));

  gulp
    .src(['node_modules/scrollreveal/dist/*.js'])
    .pipe(gulp.dest('vendor/scrollreveal'));

  gulp
    .src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json',
    ])
    .pipe(gulp.dest('vendor/font-awesome'));

  cb();
};

// Run everything
exports.default = gulp.series(compileLess, minifyCss, minifyJs, copy);

// Configure the browserSync task
const initBrowserSync = cb => {
  browserSync.init({
    server: {
      baseDir: '',
    },
  });
  cb();
};

// Dev task with browserSync
const dev = cb => {
  gulp.watch('less/*.less', compileLess);
  gulp.watch('css/*.css', minifyCss);
  gulp.watch('js/*.js', minifyJs);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
};
exports.dev = gulp.series(
  initBrowserSync,
  compileLess,
  minifyCss,
  minifyJs,
  dev,
);
