export default {
    "$schema": "../packages/cli/src/config/schema.json",
    "cloudProvider": "aws",
    "modulesPath": "./packages/modules/**/entrypoint.json",
    "workingDir": "./.epf",
    "environments": {
        "staging": {
            "tasks": []
        },
        "production": {
            "tasks": []
        }
    }
}