/**
 * Settings
 * Turn on/off build features
 */

exports.settings = {
    clean: true,
    scripts: true,
    polyfills: true,
    styles: true,
    copy: true,
    googlesite: true
};

/**
 * Paths to project folders
 */

exports.paths = {
  output: "publicTemp/assets/",
  scripts: {
    input: "src/assets/js/**/*.js",
    output: "publicTemp/assets/js/",
  },
  styles: {
    input: "src/assets/scss/**/*.{scss,sass}",
    output: "publicTemp/assets/css/",
  },
  images: {
    input: "src/assets/images/**/*",
    output: "publicTemp/assets/images/",
  },
  svgs: {
    input: "src/assets/images/**/*.svg",
    output: "publicTemp/assets/images/",
  },
  copy: {
    input: "src/assets/static/**/*",
    output: "publicTemp/assets/",
  },
  googlesite:{
    input: "src/assets/static/google2552bc5256ac1758.html",
    output: "publicTemp/",
  }
};

/**
 * Template for banner to add to file headers
 */

exports.banner = {
//     primary: `/*------------------------------------------------------------------
//     * Company Name: <%= package.name %>
//     * Author: <%= package.author.name %>
//     * Description: A <%= package.name %>.
//     * Version: <%= package.version %>
//     * Copyright ${new Date().getFullYear()} <%= package.name %>.
//     * Generated : ${new Date()}
// ------------------------------------------------------------------*/
//     `,
};
