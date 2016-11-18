"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    del = require("del"),
    html2js = require("gulp-html2js"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify");

var src = [
    "src/index.js",
    "src/*.js"
];

var vendor = [
    "node_modules/angular/angular.js",
    "node_modules/angular-route/angular-route.js",
    "node_modules/angular-sanitize/angular-sanitize.js",
    "node_modules/ng-csv/build/ng-csv.js",
    "node_modules/ng-table/bundles/ng-table.js",
];

var dest = "dist/";

gulp.task("scripts", function() {
    return gulp.src(src)
        .pipe(concat("business-license-search.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));
});

gulp.task("scripts-packaged", function() {
    return gulp.src(vendor.concat(src))
        .pipe(concat("business-license-search.packaged.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));
});

gulp.task("templates", function() {
    return gulp.src("src/*.html")
        .pipe(html2js("business-license-search.templates.js", {
            adapter: "angular",
            base: "src",
            name: "businessLicenseSearch.templates",
        }))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));
});

gulp.task("build", ["scripts", "scripts-packaged", "templates"]);

gulp.task("clean", function() { return del(dest + "*"); });

gulp.task("rebuild", ["clean", "build"]);

gulp.task("default", ["rebuild"]);