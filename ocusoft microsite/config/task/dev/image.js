// general
const { paths } = require("./../config");

const { src, dest } = require("gulp");

function image () {
    return (
        src(paths.images.input)
            .pipe(dest(paths.images.output))
    );
}

module.exports = image;
