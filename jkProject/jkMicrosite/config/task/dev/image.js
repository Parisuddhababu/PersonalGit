// general
var { paths } = require("./../config");

var { src, dest } = require("gulp");

function image() {
    return (
        src(paths.images.input)
            .pipe(dest(paths.images.output))
    );
}

module.exports = image;
