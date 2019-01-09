const { series, src, dest } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const clean = require('gulp-clean');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
const param = require('yargs').argv;
const config = require('./ftpconfig');

function deploy() {
    return src('dist/**/*')
    .pipe(ftp({
        host: config.ftp.host,
        user: config.ftp.user,
        pass: config.ftp.pass,
        remotePath: config.ftp.root
    }))
    .pipe(gutil.noop());
}

function build() {
    // copy files
    src(['src/**/*']).pipe(dest('dist'));
    // build js
    return browserify({entries: 'src/app.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(dest('dist'));
}

function clear() {
    return src('dist/*', {read: false}).pipe(clean());
}

exports.build = series(clear, build);
exports.deploy = series(clear, build, deploy);