const { paths } = require("./../config");

const gulp = require("gulp");

// Task list
const style = require("./styles");
const script = require("./script");
const svg = require("./svg");
const image = require("./image");

function watchAssets (done) {
    gulp.watch(paths.styles.input, style);
    gulp.watch(paths.scripts.input, script);
    gulp.watch(paths.images.input, image);
    gulp.watch(paths.svgs.input, svg);
    done();
}

module.exports = watchAssets;
