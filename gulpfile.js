'use strict';

const CLIENT_PORT = process.env.CLIENT_PORT || 8080;
const ASSET_URL = process.env.ASSET_URL || '/';
const COMPRESS = process.env.COMPRESS || false;

const gulp = require('gulp');
const connect = require('gulp-connect');
const jade = require('gulp-jade');
const less = require('gulp-less');
const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const modRewrite = require('connect-modrewrite');
const watch = require('gulp-watch');
const webpack = require('gulp-webpack');
const seq = require('run-sequence');
const uglify = require('gulp-uglify');

gulp.task('connect', ['default'], function () {
  connect.server({
    root: 'dist',
    port: CLIENT_PORT,
    livereload: true,
    middleware: function () {
      return [modRewrite([
        '^(?!\/assets).*$ /index.html' // Proxy all requests to index
      ])];
    }
  });
});

gulp.task('less', function () {
  return gulp.src('src/style/index.less')
    .pipe(less({
      compress: COMPRESS,
      rootpath: ASSET_URL
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('dist/assets'))
    .pipe(connect.reload());
});

gulp.task('jade', function () {
  return gulp.src('src/index.jade')
    .pipe(jade({
      locals: {
        assetURL: ASSET_URL
      },
      pretty: !COMPRESS
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('webpack', function () {
  const stream = gulp.src('./src/index.js')
    .pipe(webpack({
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      },
      output: { filename: 'bundle.js' }
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
  if (COMPRESS) { stream.pipe(uglify()); }
  stream.pipe(gulp.dest('dist/assets'))
    .pipe(connect.reload());
});

gulp.task('client_assets', function () {
  // TODO: Compress images?
  // TODO: Compress models?
  // TODO: Automatically upload to a CDN?
  return gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(connect.reload())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('lint', function () {
  gulp.src(['src/index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('default', function () {
  seq(['less', 'jade', 'webpack', 'client_assets', 'lint']);
});

gulp.task('watch', ['connect'], function () {
  watch(['./src/style/*.less', './src/style/**/*.less'], function () {
    seq('less');
  });
  watch(['./src/*.jade', './src/posts/*.jade'], function () { seq('jade'); });
  watch(['./src/index.js'], function () { seq('webpack'); });
  watch(['./src/assets/*'], function () { seq('client_assets'); });
});
