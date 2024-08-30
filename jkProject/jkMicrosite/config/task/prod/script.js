// general
var packages = require("../../../package.json");
var { paths, banner, settings } = require("./../config");

// packages
var { src, dest } = require("gulp");
var concat = require("concat");
var uglify = require("gulp-terser");
var babel = require("gulp-babel");
var flatmap = require("gulp-flatmap");
var lazypipe = require("lazypipe");
var rename = require("gulp-rename");
var header = require("gulp-header");
var include = require("gulp-include");
var optimizejs = require("gulp-optimize-js");

/**
 * @description Repeated JavaScript tasks
 */
var jsTasks = lazypipe()
    .pipe(header, banner.primary, { package: packages })
    .pipe(optimizejs)
    .pipe(include)
    .pipe(dest, paths.scripts.output)
    .pipe(rename, { suffix: ".min" })
    .pipe(uglify, {
        toplevel: true,
    })
    .pipe(optimizejs)
    .pipe(header, banner.primary, { package: packages })
    .pipe(dest, paths.scripts.output);

/**
 * @description babel, minify, and concatenate scripts
 * @param {*} done
 */
function scripts(done) {
    // Make sure this feature is activated before running
    if (!settings.scripts) return done();

    // Run tasks on script files
    return src(paths.scripts.input).pipe(
        flatmap(function (stream, file) {
            // If the file is a directory
            if (file.isDirectory()) {
                // Setup a suffix variable
                var suffix = "";

                // If separate polyfill files enabled
                if (settings.polyfills) {
                    // Update the suffix
                    suffix = ".polyfills";
                    // Grab files that aren't polyfills, concatenate them, and process them
                    src([
                        file.path + "/*.js",
                        "!" + file.path + "/*" + paths.scripts.polyfills,
                    ])
                        .pipe(concat(file.relative + ".js"))
                        .pipe(jsTasks());
                }

                // Grab all files and concatenate them
                // If separate polyfills enabled, this will have .polyfills in the filename
                src(file.path + "/*.js")
                    .pipe(concat(file.relative + suffix + ".js"))
                    .pipe(jsTasks());

                return stream;
            }

            if (!new RegExp(/lib/gi).test(file.path)) {
                // Otherwise, process the file
                return stream
                    .pipe(
                        babel({
                            presets: ["@babel/env"],
                        })
                    )
                    .pipe(jsTasks());
            }

            // Otherwise, process the file
            return stream.pipe(jsTasks());
        })
    );
}

module.exports = scripts;
