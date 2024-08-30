var gulp = require("gulp");

// Task list
var clean = require("./clean");
var style = require("./styles");
var script = require("./script");
var svg = require("./svg");
var image = require("./image");
var copy = require("./copy");
var watchAssets = require("./watch");
var googlesite = require("./googlesite");

gulp.task("default", gulp.series(clean, style, script, svg, image, copy, googlesite));
gulp.task("watch", gulp.series("default", watchAssets));
