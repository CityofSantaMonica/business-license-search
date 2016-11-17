"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify");

var dest = "dist/";

gulp.task("default", function() {
  return gulp.src(["src/index.js", "src/*.js"])
    .pipe(concat("business-license-search.js"))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest(dest));
});