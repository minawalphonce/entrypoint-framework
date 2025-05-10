import { EntitySchema } from "typeorm";
import { Auditable, enableAudit } from "../shared/audit";
import { Deletable, enableSoftDelete } from "../shared/soft-delete";

import { MemberIdentity } from "./member-identity";
import { MemberToken } from "./member-token";

export interface Member extends Deletable, Auditable {
    id: number,
    email: string,
    mobile?: string,
    isEmailVerified: boolean,
    isMobileVerified: boolean,
    verificationCode?: string,
    verificationCodeTimestamp: Date,

    identities: MemberIdentity[];
    tokens: MemberToken[];
}

export const membersSchema = new EntitySchema<Member>({
    name: "member",
    tableName: "members",
    columns: {
        "id": {
            type: "int",
            generated: "increment",
            primary: true
        },
        "email": {
            type: "varchar",
            nullable: false
        },
        "mobile": {
            type: "varchar",
            nullable: true
        },
        "isEmailVerified": {
            type: "boolean",
            nullable: false
        },
        "isMobileVerified": {
            type: "boolean",
            nullable: false
        },
        "verificationCode": {
            type: "varchar",
            nullable: true
        },
        "verificationCodeTimestamp": {
            type: "datetime",
            nullable: true
        },
        ...enableSoftDelete(),
        ...enableAudit()
    },
    relations: {
        identities: {
            target: "memberIdentity",
            type: "one-to-many",
            inverseSide: "member"
        },
        tokens: {
            target: "memberToken",
            type: "one-to-many",
            inverseSide: "member"
        }
    }
})