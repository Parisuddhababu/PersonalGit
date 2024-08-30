// general
const { paths, settings } = require("./../config");

const del = require("del");

/**
 * @description Remove pre-existing content from output folders
 * @param {*} done
 */
function clean (done) {
    // Make sure this feature is activated before running
    if (!settings.clean) return done();

    // Clean the dist folder
    del.sync([paths.output]);

    // Signal completion
    return done();
}

module.exports = clean;
