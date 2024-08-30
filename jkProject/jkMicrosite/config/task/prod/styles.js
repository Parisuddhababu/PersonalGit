// general
var packages = require("../../../package.json");
var { paths, banner, settings } = require("./../config");

// packages
var { src, dest } = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var rename = require("gulp-rename");
var header = require("gulp-header");
var prefix = require("autoprefixer");
var postcss = require("gulp-postcss");
var minify = require("gulp-clean-css");

/**
 * @description Process, lint, and minify Sass files
 */
function styles(done) {
  // Make sure this feature is activated before running
  if (!settings.styles) return done();

  // Run tasks on all Sass files
  return (
    src(paths.styles.input)
      .pipe(
        sass({
          outputStyle: "expanded",
          sourceComments: true,
        })
      )
      .pipe(
        postcss([
          prefix({
            cascade: true,
            remove: true,
          }),
        ])
      )
      .pipe(header(banner.primary, { package: packages }))
      .pipe(dest(paths.styles.output))
      .pipe(rename({ suffix: ".min" }))
      .pipe(
        minify({
          compatibility: "ie8",
        })
      )
      // .pipe(
      //   postcss([
      //     minify({
      //       compatibility: "ie8",
      //     }),
      //   ])
      // )
      .pipe(header(banner.primary, { package: packages }))
      .pipe(dest(paths.styles.output))
  );
}

module.exports = styles;
