import { EntitySchema } from "typeorm";

import { Member } from "./member";
import { App } from "./apps";

export interface MemberToken {
    appId: number;
    memberId: number;
    refreshToken: string;
    expiration: Date;
    member: Member,
    identity: "facebook" | "google" | "apple" | "password",
    app: App
}

export const memberTokensSchema = new EntitySchema<MemberToken>({
    name: "memberToken",
    tableName: "memberTokens",
    columns: {
        appId: {
            type: "int",
            primary: true
        },
        memberId: {
            type: "int",
            primary: true
        },
        refreshToken: {
            type: "varchar",
            nullable: false
        },
        expiration: {
            type: "datetime",
            nullable: false
        },
        identity: {
            type: "varchar",
            nullable: false
        }
    },
    relations: {
        app: {
            target: "app",
            type: "many-to-one",
            primary: true,
            orphanedRowAction: "delete"
        },
        member: {
            target: "member",
            type: "many-to-one",
            primary: true,
            orphanedRowAction: "delete"
        }
    }
})