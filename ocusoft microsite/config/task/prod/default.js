const gulp = require("gulp");

// Task list
const clean = require("./clean");
const style = require("./styles");
const script = require("./script");
const svg = require("./svg");
const image = require("./image");
const copy = require("./copy");
const googlesite = require("./googlesite");


gulp.task("default", gulp.series(clean, style, script, svg, image, copy, googlesite));
