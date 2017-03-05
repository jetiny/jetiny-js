var gulp = require('gulp'),
    gulpCopy = require('gulp-copy'),
    closureCompiler = require('gulp-closure-compiler'),
    gulpWebpack = require('gulp-webpack');

///////////////////////////////////////////////////////////jetiny
gulp.task('jtp', function(){
  return gulp.src([])
    .pipe(gulpWebpack({
        entry:'./src/tiny/jetiny.js',
        output:  {
            filename: "jetiny.js"
        },
        node : {
            process: false,
            console: false,
            global: false
        }
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('jtc',['jtp'], function(){
    return gulp.src('dist/jetiny.js')
        .pipe(closureCompiler({
           compilerPath: 'bower_components/closure-compiler/compiler.jar',
           fileName: 'jetiny.min.js',
           compilerFlags: {
            //closure_entry_point: 'app.main',
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            //formatting: 'PRETTY_PRINT',
            define: [
              //"goog.DEBUG=false"
            ],
            externs: [
               "tools/gcc-global.js"
            ],
            jscomp_off: "checkTypes",
            jscomp_error: "checkDebuggerStatement",
            source_map_format: "V3",
            //only_closure_dependencies: true,
            // .call is super important, otherwise Closure Library will not work in strict mode. 
            //output_wrapper: '(function(){%output%}).call(window);',
            warning_level: 'VERBOSE'
          }
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('jtd', ['jtc'], function(){
  return gulp.src(['./dist/jetiny*'])
  .pipe(gulpCopy('../../client/bower_components/jetiny/',{
      prefix: 1
    }));
});

gulp.task('jtw', function () {
    gulp.watch([
        'src/utils/*.js',
        'src/jet/*.js',
        'src/jet/config/*.js',
        'src/jet/core/*.js',
        'src/jet/plugins/*.js',
        
        'src/jet/browser/*.js',
        'src/jet/browser/request/*.js',
        
        'src/tiny/*.js',
        
        'tools/*.js',
    ], ['jtd']);
});

gulp.task('default', ['jtw']);