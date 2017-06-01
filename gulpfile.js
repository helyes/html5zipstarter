/// <reference path="../../typings/tsd.d.ts" />

'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const fs = require('fs');
const git = require('git-rev');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const artifactFolder = 'dist-artifact';



gulp.task('styles', function () {
  return gulp.src('app/styles/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    //.pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe($.if('*.css', $.rev()))
    .pipe($.if('*.js', $.rev()))
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'Processed html,'}));
});


/**
 * Extends rev-d manifest file by adding ../ front of all keys and values
 * Required for css image revs as css files sit in a subfolder and image url is ../images/image.png
 * as opposed to html's image/image.png.
 * cat ./dist/images/rev-manifest-extended.json
 *
 */
var extendManifest = function (manifest) {
  var manifestRev = require(manifest);
  var manifestExtended = {};

  for (var key in manifestRev) {
    if (manifestRev.hasOwnProperty(key)) {
      manifestExtended[key] = manifestRev[key];
      manifestExtended['../' + key] = '../' + manifestRev[key];
    }
  }
  //contains both images/image.png and ../images/images.png for search and replace
  var extendedManifestFile = './dist/images/rev-manifest-extended.json';
  fs.writeFileSync(extendedManifestFile, JSON.stringify(manifestExtended, undefined, 2));
  console.log('File ' + extendedManifestFile + ' has been successfully created');
  return extendedManifestFile;
};


gulp.task('images', () => {
  return gulp.src('app/images/**/*', {base: 'app'})
    .pipe($.print())
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe($.rev())
    .pipe($.print())
    .pipe(gulp.dest('dist'))
    .pipe($.print())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('dist/images'))
    .pipe($.print())
    .pipe($.size({title: 'Processed'}));
});

gulp.task('revimages', ['html', 'images'], function () {

  var extendedManifest = extendManifest('./dist/images/rev-manifest.json');
  var manifest = require(extendedManifest);

  var options = {
     //base: 'images',
    //prefix: 'images',
    verbose: false
  };

  return gulp.src(['dist/*.html', 'dist/styles/*.css'])
      //.pipe($.print())
      .pipe($.fingerprint(manifest, options))
      .pipe($.if('*.css',  gulp.dest('dist/styles')))
      .pipe($.if('*.html', gulp.dest('dist')));
});


gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist', artifactFolder]));

gulp.task('clean:artifacts', del.bind(null, [artifactFolder]));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['lint', 'scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('zip:dist', ['clean:artifacts'], (cb) => {
    $.git.exec({args : 'rev-parse --abbrev-ref HEAD'}, function (err, stdout) {
          if (err) {
            return cb(err);
          }

          var stream = gulp.src(['dist/**/*'])
            .pipe($.zip(stdout.trim() + '.zip'))
            .pipe(gulp.dest(artifactFolder))
            .pipe($.print(function(filepath) {
                    return 'Artifact has been successfully created: ' + (__dirname + '/' + filepath);
                  })
            )
            .pipe($.size({title: 'Compressed'}))
            .on('end', cb);
    });
});


gulp.task('build', ['lint', 'html', 'revimages', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
