const staging_env = require("./environments/env.stage.json");
const development_env = require("./environments/env.dev.json");
const production_env = require("./environments/env.prod.json");

module.exports = {
    apps: [
        {
            name: "front.ocusoftms.in",
            script: "npm",
            args: "start",
            watch: false,
            env: development_env,
            env_production: production_env,
            env_staging: staging_env,
        },
    ],
};
