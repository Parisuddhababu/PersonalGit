// general
var { paths, settings } = require("./../config");

var { src, dest } = require("gulp");
var svgmin = require("gulp-svgmin");

/**
 * @description Optimize SVG files
 * @param {*} done
 */
function svg(done) {
    // Make sure this feature is activated before running
    if (!settings.svgs) return done();

    // Optimize SVG files
    return src(paths.svgs.input).pipe(svgmin()).pipe(dest(paths.svgs.output));
}

module.exports = svg;
