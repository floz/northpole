var gulp = require( "gulp" );

var plumber = require( "gulp-plumber" );
var gutil = require( "gulp-util" );

var bower = require( "gulp-bower" );

var jade = require( "gulp-jade" );
var stylus = require( "gulp-stylus" );
var nib = require( "nib" );
var coffee = require( "gulp-coffee" );
var rename = require( "gulp-rename" );
var concat = require( "gulp-concat" );

var browserify = require( "gulp-browserify" );
var browserifyShader = require( "browserify-shader" );
var source = require( "vinyl-source-stream" );
var html = require( "html-browserify" );
var coffeeify = require( "coffeeify" );

var browserSync = require( "browser-sync" );
  
var src = {
  styles: "src/styles/",
  scripts: "./src/scripts/",
  templates: "src/templates/",
}

gulp.task( "browser-sync", function() {

  browserSync.init( [ "app/js/*.js", "app/css/*.css", "app/*.html", "app/obj/*.obj", "app/obj/*.png", "app/obj/*.mtl" ], {
    server: {
      baseDir: "./app"
    }
  } );

});

gulp.task( "bower-install", function() {

  bower( "app/js/bower_components" );

});

gulp.task( "styles", function() {

  gulp.src( src.styles + "*.styl" )
      .pipe( plumber() )
      .pipe( stylus( { 
          use: [ nib() ], 
          url: { name: "url", paths: [ "src/imgs" ], limit: false } 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/css/" ) );

});

gulp.task( "templates", function() {

  gulp.src( src.templates + "index.jade")
      .pipe( plumber() )
      .pipe( jade( { pretty: true, basedir: "src/templates/" } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( gulp.dest( "app/" ) );

});


gulp.task( "scripts", function() {
    gulp.src( src.scripts + "Main.coffee", { read: false } )
      .pipe( browserify( { 
          paths: [ "src/scripts/" ], 
          transform: [ html, "coffeeify" ], 
          extensions: [ ".coffee" ] 
        } ) )
        .on( "error", gutil.log )
        .on( "error", gutil.beep )
      .pipe( rename( "app.js" ) )
      .pipe( gulp.dest( "app/js" ) );

} );


gulp.task( "watch", function() {

  gulp.watch( "src/styles/**/*.styl", [ "styles" ] );
  gulp.watch( "src/templates/**/*.jade", [ "templates", "scripts" ] );
  gulp.watch( "src/scripts/**/*.coffee", [ "scripts" ] );

});


gulp.task( "default", [ "bower-install", "browser-sync", "styles", "templates", "scripts", "watch" ] );
gulp.task( "tscripts", [ "scripts" ] );
