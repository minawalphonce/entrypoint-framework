import { EntitySchema, Repository } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";

import * as entities from "./entities";
import { extendRepositories } from "./repositories";

type ExtendedRepositories = typeof extendRepositories;
type ExtendedRepositoriesKeys = keyof ExtendedRepositories;

type GenericParameter<T> = T extends EntitySchema<infer U> ? U : never;

export type EntityNames = { [P in keyof typeof entities]: P extends `${infer K}Schema` ? K : never }[keyof typeof entities];

export type Repositories = {
    [k in EntityNames]: Repository<GenericParameter<typeof entities[`${k}Schema`]>> & (k extends ExtendedRepositoriesKeys ? ReturnType<ExtendedRepositories[k]> : {})
}

export type GlobalHelpers = {
    createTransaction: () => Transaction
}

export type Transaction = {
    start(isolationLevel?: IsolationLevel): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
} & Repositories
