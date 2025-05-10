import { EntitySchema } from "typeorm";

import { SystemAuditable, enableSystemAudit } from "../shared/audit";
import { Deletable, enableSoftDelete } from "../shared/soft-delete";
import { MemberToken } from "./member-token";

export interface App extends SystemAuditable, Deletable {
    id: number,
    name: string;
    secret?: string | null;
    salt?: string | null;
    source?: string | null;
    type: "web-app" | "native-app" | "server",

    tokens: MemberToken[];
}

export const appsSchema = new EntitySchema<App>({
    name: "app",
    tableName: "apps",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        name: {
            type: "varchar",
            nullable: false
        },
        secret: {
            type: "varchar",
            nullable: true
        },
        salt: {
            type: "varchar",
            nullable: true
        },
        source: {
            type: "varchar",
            nullable: true
        },
        type: {
            type: "varchar",
            nullable: false
        },
        ...enableSoftDelete(),
        ...enableSystemAudit()
    },
    relations: {
        tokens: {
            target: "memberToken",
            type: "one-to-many",
            inverseSide: "app"
        }
    }
})