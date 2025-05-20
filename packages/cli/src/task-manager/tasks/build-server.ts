import path from "node:path";
import tsup from "tsup";

import { Task } from "../../types.js";

function mapCloud(provider: string) {
    switch (provider) {
        case "aws":
            return "@entrypoint-framework/aws-cloud-provider";
        case "azure":
            return "@entrypoint-framework/azure-cloud-provider";
        case "gcp":
            return "@entrypoint-framework/gcp-cloud-provider";
        default:
            return provider;
    }
}

export const buildServer: Task = {
    title: ({ moduleName }) => `Build Server for ${moduleName}`,
    skip: (params) => {
        return params.environment === "develop";
    },
    action: async ({ moduleDir, cloudProvider, externalPackages }) => {
        debugger;
        const modulePath = path.resolve(moduleDir, "index.ts");
        return await tsup.build({
            entry: {
                index: modulePath,
            },
            external: [...externalPackages],
            noExternal: ['lodash'],
            esbuildOptions: (options) => {
                options.absWorkingDir = moduleDir;
                options.alias = {
                    "@@cloudcore": "@entrypoint-framework/cloud-core",
                    "@@cloud": mapCloud(cloudProvider),
                    "@@datastore": "@entrypoint-framework/datastore",
                    "@@utils": "@entrypoint-framework/utils",
                }
                return options;
            },
            bundle: true,
            sourcemap: false,
            outDir: moduleDir,
            platform: "node",
            dts: false,
            watch: false,
            define: {
                __DEV__: process.env.__DEV__ || "false",
            },
            esbuildPlugins: [],
        });
    }
}