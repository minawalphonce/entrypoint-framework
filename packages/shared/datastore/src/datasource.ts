import { DataSource, ObjectLiteral, EntitySchema, Repository, EntityManager } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { logger } from "@anubis/utils";

import { config } from "./config";
import * as entities from "./entities";
import { Repositories, GlobalHelpers, Transaction } from "./types";
import { extendRepositories } from "./repositories";


//#region [Datasource]
let datasource: DataSource;
async function initialize() {
    try {
        if (!datasource || !datasource.isInitialized) {
            datasource = new DataSource({
                ...config,
                migrationsRun: false,
                synchronize: false,
                entities: Object.values(entities)
            });
            await datasource.initialize();
            //@ts-expect-error
            repositories = {};
            createRepositories(repositories);
            createGlobalHelpers(repositories);
        }
    } catch (error) {
        logger.fatal(error);
        throw error;
    }
}
//#endregion

//#region [ Repositories ]
let repositories: Repositories & GlobalHelpers;

function createRepositories(target: Repositories, source?: EntityManager) {
    let repoCash: Record<string, Repository<any>> = {};
    const getRepository = <Entity extends ObjectLiteral, CustomRepository>(schema: EntitySchema<Entity>, extend?: CustomRepository) => {
        const localSource = source || datasource;
        if (!repoCash[schema.options.name]) {
            repoCash[schema.options.name] = localSource.getRepository(schema);
            if (extend)
                repoCash[schema.options.name] = repoCash[schema.options.name].extend(extend);
        }
        return repoCash[schema.options.name] as Repository<Entity> & CustomRepository;
    }
    Object.keys(entities).reduce((acc, key) => {
        acc = Object.defineProperty(acc, key.replace("Schema", ""), {
            get: () => {
                //@ts-expect-error
                const extend = extendRepositories[key.replace("Schema", "")];
                //@ts-expect-error
                return getRepository(entities[key], extend && extend());
            }
        });
        return acc;
    }, target);
}

function createGlobalHelpers(target: GlobalHelpers) {
    target.createTransaction = () => {
        let queryRunner = datasource.createQueryRunner();
        // @ts-expect-error
        const transactionObj: Transaction = {
            async start(isolationLevel?: IsolationLevel) {
                await queryRunner.connect();
                await queryRunner.startTransaction(isolationLevel);
            },
            async commit() {
                await queryRunner.commitTransaction();
                await queryRunner.release();
                queryRunner = undefined;
            },
            async rollback() {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                queryRunner = undefined;
            },
        };
        createRepositories(transactionObj, queryRunner.manager);
        return transactionObj;
    }
}

//#endregion

export {
    initialize,
    repositories
}