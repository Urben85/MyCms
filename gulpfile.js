const { series, src, dest } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const clean = require('gulp-clean');
const gutil = require('gulp-util');
const ftp = require('gulp-ftp');
var uglify = require('gulp-uglify');
var pump = require('pump');
const param = require('yargs').argv;
const config = require('./ftpconfig');

function deploy(cb) {
    ftpUpload('dist/**/*',remotePath(param.app),cb);
}

function deployHTML(cb) {
    ftpUpload('dist/*.html',remotePath(param.app),cb);
}

function deployCSS(cb) {
    ftpUpload('dist/css/*',remotePath(param.app) + '/css',cb);
}

function deployJS(cb) {
    ftpUpload('dist/*.js',remotePath(param.app),cb);
}

function deployPHP(cb) {
    ftpUpload('dist/php/**/*.php',remotePath(param.app) + '/php',cb);
}

function build() {
    // copy files
    src('src/apps/' + param.app + '/**/*').pipe(dest('dist'));
    src('src/commonphp/**/*').pipe(dest('dist/php'));
    // build js
    return browserify({entries: 'src/apps/' + param.app + '/' + param.app + '.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source(param.app + '.js'))
        .pipe(dest('dist'));
}

function compressJS(cb) {
    pump(
        [
            src('dist/*.js'),
            uglify(),
            dest('dist')
        ],
        cb
    );
}

function clear() {
    return src('dist/*', {read: false}).pipe(clean());
}

function remotePath(app) {
    if (app === 'admin')
        return config.ftp.root + '/' + app;
    else
        return config.ftp.root;
}

function ftpUpload(source,target,cb) {
    src(source)
    .pipe(ftp({
        host: config.ftp.host,
        user: config.ftp.user,
        pass: config.ftp.pass,
        remotePath: target
    }))
    .pipe(gutil.noop());
    cb();
}

exports.build = series(clear, build, compressJS);
exports.deploy = series(clear, build, compressJS, deploy);
exports.deployhtml = series(clear, build, deployHTML);
exports.deploycss = series(clear, build, deployCSS);
exports.deployjs = series(clear, build, deployJS);
exports.deployphp = series(clear, build, deployPHP);