import { env } from "@entrypoint-framework/utils";

export function local<TVAL>(prod: TVAL, local: TVAL) {
    return env("DATABASE_TYPE") === "mysql"
        ? prod
        : local;
}