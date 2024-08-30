// general
const { paths, settings } = require("./../config");

const { src, dest } = require("gulp");

/**
 * @param {*} done
 * @description Copy static files into output folder
 */
function copy (done) {
    // Make sure this feature is activated before running
    if (!settings.copy) return done();

    // Copy static files
    return src(paths.copy.input).pipe(dest(paths.copy.output));
}

module.exports = copy;
