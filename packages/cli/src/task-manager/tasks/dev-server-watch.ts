import path from "node:path";
import { ChildProcess, fork } from "node:child_process";
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

export const devServerWatch: Task = {
    title: 'Dev Server Watch',
    skip: () => false,
    action: async ({ workingDir, cloudProvider }, logger) => {
        const entryPath = path.resolve(workingDir, "app.ts");
        await tsup.build({
            entry: {
                index: entryPath
            },
            external: ["sqlite3"],
            esbuildOptions: (options) => {
                options.absWorkingDir = workingDir;
                options.alias = {
                    "@@cloudecore": "@entrypoint-framework/cloud-core",
                    "@@cloud": mapCloud(cloudProvider),
                }
                return options;
            },
            bundle: true,
            sourcemap: true,
            outDir: workingDir,
            platform: "node",
            dts: false,
            watch: false,
            env: {
                __ENV_PATH__: '"' + path.resolve(__dirname, "../.env").replace(/\\/g, "\\\\") + '"',
                __DEV__: process.env.__DEV__ || '"development"'
            },
            esbuildPlugins: [{
                name: "capture-logs",
                setup: (build) => {
                    let childProcess: any = null;
                    const { outdir } = build.initialOptions;
                    // const main = path.resolve(outdir, "index.cjs");
                    // console.log("outDir ==>", outdir);
                    build.onEnd((buildResult) => {
                        if (buildResult.errors.length > 0) {
                            buildResult.errors.forEach(logger);
                        }
                        if (buildResult.warnings.length > 0) {
                            buildResult.warnings.forEach(logger);
                        }
                        // childProcess = startModule(main, ["--enable-source-maps"]);

                    })
                }
            }],
            // silent: true // Prevent console output
        });
    }
}

function startModule(main: any, execArgv: any) {
    const child = fork(main, { env: process.env, execArgv, stdio: "inherit" })
        .on("error", function (error) {
            console.error(error);
        })
        .on("close", function (code) {
            child.kill("SIGINT");
        });
    return child;
}