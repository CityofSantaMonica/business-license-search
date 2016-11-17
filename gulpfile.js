"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    html2js = require("gulp-html2js"),
    merge = require("merge-stream"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify");

var src = [
    "node_modules/angular/angular.min.js",
    "node_modules/ng-csv/build/ng-csv.min.js",
    "node_modules/ng-table/bundles/ng-table.min.js",
    "src/index.js",
    "src/*.js"
];

var dest = "dist/";

gulp.task("default", function() {
    var templates = gulp.src("src/*.html")
        .pipe(html2js("business-license-search.templates.js", {
            adapter: "angular",
            name: "businessLicenseSearch",
        }))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));

    var js = gulp.src(src)
        .pipe(concat("business-license-search.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));

    return merge(js, templates);
});