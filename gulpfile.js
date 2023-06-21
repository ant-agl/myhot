"use strict";

var gulp = require("gulp"),
  prefixer = require("autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  rigger = require("gulp-rigger"),
  cssmin = require("gulp-minify-css"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  rimraf = require("rimraf"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  webpackStream = require("webpack-stream"),
  webpack = require("webpack"),
  postcss = require("gulp-postcss");

var path = {
  build: {
    html: [
      "build/",
      "build/lk/",
      "build/hotels-list/",
      "build/hotel/",
      "build/booking/",
    ],
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    fonts: "build/fonts/",
    files: "build/files/",
  },
  src: {
    html: [
      "src/*.html",
      "src/lk/*.html",
      "src/hotels-list/*.html",
      "src/hotel/*.html",
      "src/booking/*.html",
    ],
    js: [
      "./src/js/index.js",
      "./src/js/lk.js",
      "./src/js/hotels_list.js",
      "./src/js/hotel.js",
      "./src/js/booking.js",
    ],
    css: [
      "src/css/index.css",
      "src/css/lk.css",
      "src/css/hotels-list.css",
      "src/css/hotel.css",
      "src/css/booking.css",
    ],
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    files: "src/files/**/*.*",
  },
  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    css: "src/css/**/*.css",
    img: "src/img/**/*.*",
    fonts: "src/fonts/**/*.*",
    files: "src/files/**/*.*",
  },
  clean: "./build",
};

function htmlBuild(done) {
  path.src.html.forEach((src, i) => {
    gulp
      .src(src)
      .pipe(rigger())
      .pipe(gulp.dest(path.build.html[i]))
      .pipe(reload({ stream: true }));
  });
  done();
}

function jsBuild(done) {
  gulp
    .src(path.src.js)
    .pipe(
      webpackStream({
        entry: {
          index: path.src.js[0],
          lk: path.src.js[1],
          hotels_list: path.src.js[2],
          hotel: path.src.js[3],
          booking: path.src.js[4],
        },
        mode: "development", // production
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
          ],
        },
        plugins: [
          new webpack.ProvidePlugin({
            $: "jquery",
          }),
        ],
      })
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));

  done();
}

function cssBuild(done) {
  gulp
    .src(path.src.css)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(postcss([prefixer()]))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
  done();
}

function imgBuild(done) {
  return gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true,
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
}

function fontsBuild(done) {
  gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
  done();
}

function filesCopy() {
  return gulp.src(path.src.files).pipe(gulp.dest(path.build.files));
}

exports.build = gulp.parallel(
  htmlBuild,
  jsBuild,
  cssBuild,
  fontsBuild,
  imgBuild,
  filesCopy
);

function watch(done) {
  gulp.watch(path.watch.html, htmlBuild);
  gulp.watch(path.watch.js, jsBuild);
  gulp.watch(path.watch.css, cssBuild);
  gulp.watch(path.watch.fonts, fontsBuild);
  gulp.watch(path.watch.img, imgBuild);
  gulp.watch(path.watch.files, filesCopy);
  done();
}
exports.watch = gulp.series(watch);

function clean(cb) {
  rimraf(path.clean, cb);
}
exports.clean = gulp.series(clean);

var config = {
  server: {
    baseDir: "./build",
  },
  tunnel: false,
  host: "localhost",
  port: 9001,
  logPrefix: "front",
};

function webserver(done) {
  browserSync(config);
  done();
}

exports.default = gulp.series(clean, exports.build, webserver, watch);
