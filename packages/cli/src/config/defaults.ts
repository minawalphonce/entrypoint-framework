import { Config } from "../types.js";

import {
    loadModuleTemplate,
    loadDevServerTemplate,
    locateModules,
    transformDevServer,
    devServerWatch,
    transformModule,
} from "../task-manager/index.js";


export const defaultConfig: Config = {
    modulesPath: './packages/modules/**/entrypoint.json',
    cloudProvider: 'aws',
    workingDir: "./.epf",
    environments: {
        develop: {
            moduleTemplatePath: "./templates/local/module.ts.ejs",
            devServerTemplatePath: "./templates/local/dev-server.ts.ejs",
            tasks: [
                loadModuleTemplate,
                loadDevServerTemplate,
                locateModules,
                transformDevServer
            ],
            watch: devServerWatch
        },
        prod: {
            moduleTemplatePath: "./templates/cloud/module.ts.ejs",
            tasks: [
                loadModuleTemplate,
                //locateModule,
                transformModule
            ]
        }

    }
}