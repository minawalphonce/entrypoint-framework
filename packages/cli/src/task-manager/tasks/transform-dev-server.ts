import fs from "node:fs/promises";
import path from "node:path";

import { Task } from "../../types.js";

/**
 * convert the module template into a compilable function 
 * @param {string} devServerTemplateFunc
 * @returns {function} moduleTemplate
 */
export const transformDevServer: Task = {
    title: `transform Dev Server`,
    skip: () => false,
    action: async ({
        moduleNames,
        devServerTemplateFunc,
        workingDir
    }) => {

        const rendered = devServerTemplateFunc({
            source: "./src",
            moduleNames
        });

        await fs.mkdir(workingDir, { recursive: true });
        await fs.writeFile(path.join(workingDir, `app.ts`), rendered, "utf-8");
    }
}