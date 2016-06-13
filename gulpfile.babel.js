import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import path from 'path';
import mkdirp from 'mkdirp';
import { Instrumenter } from 'isparta';
import child_process from 'child_process';

const $ = gulpLoadPlugins();
const DST_DIR = './dist';
const MOCHA_GLOBALS = [
    "stub",
    "spy",
    "expect"
];

// Remove the built files
gulp.task('clean', function() {
    return del([DST_DIR]);
});

// Send a notification when JSHint fails,
// so that you know your changes didn't build
function jshintNotify(file) {
    if (!file.jshint) {
        return;
    }
    return file.jshint.success ? false : 'JSHint failed';
}

function jscsNotify(file) {
    if (!file.jscs) {
        return;
    }
    return file.jscs.success ? false : 'JSCS failed';
}

function createLintTask(taskName, files) {
    gulp.task(taskName, function() {
        return gulp.src(files)
            .pipe($.plumber())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.notify(jshintNotify))
            .pipe($.jscs())
            .pipe($.jscs.reporter())
            .pipe($.notify(jscsNotify))
            .pipe($.jshint.reporter('fail'));
    });
}

// Lint our source code
createLintTask('lint-src', ['src/**/*.js'])

// Lint our test code
createLintTask('lint-test', ['test/**/*.js'])

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function() {

    // Create our output directory
    mkdirp.sync(DST_DIR);
    return gulp.src('src/**/*.js')
        .pipe($.plumber())
        .pipe($.babel())
        .pipe(gulp.dest(DST_DIR));
});

function test() {
    return gulp.src('test/unit/**/*.js', {read: false})
        .pipe($.plumber())
        .pipe($.mocha({reporter: 'spec', globals: MOCHA_GLOBALS}));
}

gulp.task('coverage', function(done) {
    gulp.src(['src/*.js'])
        .pipe($.plumber())
        .pipe($.istanbul({instrumenter: Instrumenter}))
        .pipe($.istanbul.hookRequire())
        .on('finish', function() {
            return test()
                .pipe($.istanbul.writeReports())
                .on('end', done);
        });
});

gulp.task('apidocs', function() {
    var args = [
        './node_modules/jsdoc/jsdoc.js',
        '-r',
        'src',
        '-d',
        'apidocs'
    ];

    var jsdoc = child_process.spawn('node', args);

    jsdoc.stdout.on('data', function(data) {
        process.stdout.write(data);
    });

    jsdoc.stderr.on('data', function(data) {
        process.stdout.write(data);
    });
});

// Lint and run our tests
gulp.task('test', ['lint-src', 'lint-test'], test);

// Run the headless unit tests as you make changes.
gulp.task('watch', ['test'], function() {
    gulp.watch(['src/**/*', 'test/**/*', 'package.json', '**/.jshintrc', '.jscsrc'], ['test']);
});

// An alias of test
gulp.task('default', ['test']);
