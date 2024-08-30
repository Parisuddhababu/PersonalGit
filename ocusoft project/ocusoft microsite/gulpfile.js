const requireDir = require("require-dir");

const environments = require("gulp-environments");
const development = environments.development();
const production = environments.production();

if (development) {
    requireDir("./config/task/dev", { recurse: true });
}

if (production) {
    requireDir("./config/task/prod", { recurse: true });
}
