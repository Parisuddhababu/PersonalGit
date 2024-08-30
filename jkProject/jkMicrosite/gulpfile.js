var requireDir = require("require-dir");

var environments = require("gulp-environments");
var development = environments.development();
var production = environments.production();

if (development) {
    requireDir("./config/task/dev", { recurse: true });
}

if (production) {
    requireDir("./config/task/prod", { recurse: true });
}
