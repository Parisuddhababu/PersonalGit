// general
var { paths } = require("./../config");

var { src, dest } = require("gulp");

function googlesite() {
    return (
        src(paths.googlesite.input)
            .pipe(dest(paths.googlesite.output))
    );
}

module.exports = googlesite;
