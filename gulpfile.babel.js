"use strict";

const { src, dest, series, watch } = require("gulp"),
      babel = require("gulp-babel"),
      plugins = require("gulp-load-plugins")(),
      browserSync = require("browser-sync").create(),
      autoprefixer = require("autoprefixer"),
      del = require("del");

function server() {
  browserSync.init({ server: "./build" });

  watch("source/*.html", series(html, refresh));
  watch("source/sass/**/*", series(css, refresh));
  watch("source/js/*.js", series(js, refresh));
}

function refresh(done) {
  browserSync.reload();
  done();
}

function html() {
  return src("source/*.html", { base: "source" })
    .pipe(dest("build"));
}

function beautifyHtml() {
  return src("source/*.html")
    .pipe(plugins.beautifyCode({
      indent_size: 2,
      indent_char: ' ',
      indent_inner_html: true,
      unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'],
      end_with_newline: true
    }))
    .pipe(dest("source/"));
}

function css() {
  return src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(plugins.postcss([ autoprefixer() ]))
    .pipe(plugins.csso())
    .pipe(plugins.rename({ suffix: ".min" }))
    .pipe(dest("build/css", { sourcemaps: "."}));
}

function js() {
  return src("source/js/*.js", { sourcemaps: true })
    .pipe(babel({ presets: [ 'babel-preset-env' ] }))
    .pipe(plugins.jsmin())
    .pipe(plugins.rename({ suffix: ".min" }))
    .pipe(dest("build/js", { sourcemaps: "."}))
    .pipe(src("source/js/libs/*", { base: "source" }))
    .pipe(dest("build/"));
}

function beautifyJs() {
  return src("source/js/*.js")
    .pipe(plugins.beautifyCode({
      indent_size: 2,
      indent_char: ' ',
      end_with_newline: true
    }))
    .pipe(dest("source/js/"));
}

function copy() {
  return src([
    "source/img/**/*",
    "source/fonts/*"],
    { base: "source"})
    .pipe(dest("build"));
}

function clean() {
  return del("build");
}

async function build() {
  await clean();
  await copy();
  await css();
  await js();
  await html();
}

exports.default = series(build, server);
exports.build = build;
exports.beautifyHtml = beautifyHtml;
exports.beautifyJs = beautifyJs;
