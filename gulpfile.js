"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    del = require("del"),
    html2js = require("gulp-html2js"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify");

var src = [
    "src/index.js",
    "src/*.js",
    "!src/settings.js"
];

var settings = ["src/settings.js"];

var vendor = [
    "node_modules/angular/angular.min.js",
    "node_modules/angular-route/angular-route.min.js",
    "node_modules/angular-sanitize/angular-sanitize.min.js",
    "node_modules/ng-csv/build/ng-csv.min.js",
    "node_modules/ng-table/bundles/ng-table.min.js",
];

var dest = "dist/";

gulp.task("src", function() {
    return gulp.src(src)
        .pipe(concat("business-license-search.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest));
});

gulp.task("settings", function() {
    return gulp.src(settings)
        .pipe(concat("business-license-search.settings.js"))
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

gulp.task("vendor", function() {
    return gulp.src(vendor)
        .pipe(concat("business-license-search.vendor.js"))
        .pipe(gulp.dest(dest));
});

gulp.task("build", ["src", "settings", "templates", "vendor"]);

gulp.task("clean", function() { return del(dest + "*"); });

gulp.task("rebuild", ["clean", "build"]);

gulp.task("default", ["rebuild"]);