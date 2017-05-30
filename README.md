# html5zipstarter

Html5 starter project for zipped html5 content.

## Setting up

### Requirements

This project requires [node js](https://nodejs.org/en), gulp and bower installed.

Run the commands below in a terminal window to install gulp and bower globally.

    11:37 $ npm install -g gulp-cli
    11:39 $ npm install -g bower

### Prerequisites

Node and bower packages need to be installed before starting working on the project.


**Checkout project**

    11:56 $ git checkout


**Run npm install**

The below command will install all node dependencies. The actual output of *npm install* is more verbose. Kept it short here for brevity.

    11:59 $ npm install
    npm WARN deprecated node-uuid@1.4.8: Use uuid module instead
    npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
    ...


**Run bower install**

    12:13 $ bower install
    bower jquery#~2.1.1             cached https://github.com/jquery/jquery-dist.git#2.1.4
    bower jquery#~2.1.1           validate 2.1.4 against https://github.com/jquery/jquery-dist.git#~2.1.1
    ...

## How to use

### Running project

The actual branch can be hosted by executing *gulp serve* in a terminal as per below

    12:14 $ gulp serve
    [12:15:01] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [12:15:01] Starting 'styles'...
    [12:15:01] Starting 'scripts'...
    [12:15:01] Starting 'fonts'...
    [12:15:01] Finished 'fonts' after 26 ms
    [12:15:01] Finished 'scripts' after 119 ms
    [12:15:01] Finished 'styles' after 441 ms
    [12:15:01] Starting 'serve'...
    [12:15:01] Finished 'serve' after 89 ms
    [BS] Access URLs:
     --
        Local: http://localhost:9000
        External: http://192.168.1.112:9000
     --------------------------------------
              UI: http://localhost:3001
     UI External: http://192.168.1.112:3001
     --------------------------------------
    [BS] Serving files from: .tmp
    [BS] Serving files from: app

The output may vary.

Project can be accessible on http://localhost:3001 .



## Gulp tasks

### build

 **Builds the optimized website in dist folder**

 * lints (error checks) custom javascripts
 * optimizes and minifies html files by removing whitespaces and comments and puts output as
   * dist/index.html
 * minifies and sign css files
   * dist/styles/main-71d566fd13.css - custom, concatenated css files
   * dist/styles/vendor-72796422.css - concatenated vendor css files
 * minifies and sign javascript files
   * dist/styles/main-71d566fd13.css - custom, concatenated css files
   * dist/styles/vendor-72796422.css - concatenated vendor css files
 * optimizes and signs image files and put them into folder below
   * dist/images


**Example**

    10:56 $ gulp build
    [12:43:45] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [12:43:45] Starting 'lint'...
    ...
    [12:43:50] build all files 745.77 kB (gzipped)
    [12:43:50] Finished 'build' after 53 ms

The output above is shortened for brevity

**Result**

    12:45 $ tree dist
    dist
    ├── apple-touch-icon.png
    ├── favicon.ico
    ├── images
    │   ├── concrete_seamless-fa6a95e71d.png
    │   ├── photo-10c911c41c.jpg
    │   ├── rev-manifest-extended.json
    │   └── rev-manifest.json
    ├── index.html
    ├── robots.txt
    ├── scripts
    │   ├── main-64a6efa3bf.js
    │   ├── vendor
    │   │   └── modernizr-272916a077.js
    │   └── vendor-4637e41d8f.js
    └── styles
        ├── main-71d566fd13.css
        └── vendor-727964221d.css



### clean

**Purges all generated files**

Contents of folders below will be deleted
* dist
* .tmp

**Example**

    12:47 $ gulp clean
    [12:49:09] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [12:49:09] Starting 'clean'...
    [12:49:09] Finished 'clean' after 28 ms

### clean:artifact

**Purges artifact folder**

By default it is
* dist-artifact

**Example**

    12:50 $ gulp clean:artifacts
    [12:50:25] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [12:50:25] Starting 'clean:artifacts'...
    [12:50:25] Finished 'clean:artifacts' after 4.51 ms

### serve

**Serves app folder**
 * uses browserSync to update or reload browser viewport if anything changes under
   * app/*.html
   * app/images/**/*
   * .tmp/fonts/**/*
   * app/styles/**/*.css
   * app/scripts/**/*.js
   * app/fonts/**/*
   * bower.json

**Example**

    12:14 $ gulp serve
    [12:15:01] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [12:15:01] Starting 'styles'...
    [12:15:01] Starting 'scripts'...
    [12:15:01] Starting 'fonts'...
    [12:15:01] Finished 'fonts' after 26 ms
    [12:15:01] Finished 'scripts' after 119 ms
    [12:15:01] Finished 'styles' after 441 ms
    [12:15:01] Starting 'serve'...
    [12:15:01] Finished 'serve' after 89 ms
    [BS] Access URLs:
     --
        Local: http://localhost:9000
        External: http://192.168.1.112:9000
     --------------------------------------
              UI: http://localhost:3001
     UI External: http://192.168.1.112:3001
     --------------------------------------
    [BS] Serving files from: .tmp
    [BS] Serving files from: app

    The output may vary.

    Project can be accessible on http://localhost:3001

### serve:dist

**Serves dist folder**

This tasks requires *gulp build* to be ran previously. Otherwise there will be nothing to serve as dist folder has no content

**Example**

    12:52 $ gulp serve:dist
    [10:59:52] Using gulpfile ~/work/html5zipstarter/gulpfile.js
    [10:59:52] Starting 'serve:dist'...
    [10:59:52] Finished 'serve:dist' after 71 ms
    [BS] Access URLs:
     ----------------------------
     Local: http://localhost:9000
     ----------------------------
        UI: http://localhost:3001
     ----------------------------
    [BS] Serving files from: dist
