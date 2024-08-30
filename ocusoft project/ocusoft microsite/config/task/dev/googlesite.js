// general
const { paths } = require("./../config");

const { src, dest } = require("gulp");

function googlesite () {
    return (
        src(paths.googlesite.input)
            .pipe(dest(paths.googlesite.output))
    );
}

module.exports = googlesite;
