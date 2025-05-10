import type { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import type { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { env } from "@entrypoint-framework/utils";

const type = env('DATABASE_TYPE', 'mysql') as keyof typeof connections;

const connections = {
    mysql: {
        type: "mysql",
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        database: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool(
                'DATABASE_SSL_REJECT_UNAUTHORIZED',
                true
            )
        },
        poolSize: env.int('DATABASE_POOL_MAX'),
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT'),
        legacySpatialSupport: false,
        extra: {
            queueLimit: 0,
            // Increase packet size
            maxPreparedStatements: 500,
            // Enable compression for large data
            compress: true,
        },
        logging: ["error"]
    } as MysqlConnectionOptions,
    postgres: {
        type: "postgres",
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool(
                'DATABASE_SSL_REJECT_UNAUTHORIZED',
                true
            ),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
        poolSize: env.int('DATABASE_POOL_MAX', 10),
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000)
    } as PostgresConnectionOptions,
    sqlite: {
        type: "sqlite",
        database: env('DATABASE_FILENAME', 'data.db'),
        debug: true,
        logging: false,
    } as SqliteConnectionOptions
};

export const config = connections[type];