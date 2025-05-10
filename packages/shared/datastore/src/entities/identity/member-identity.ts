import { EntitySchema } from "typeorm";
import { Member } from "./member";

export interface MemberIdentity {
    id: number,
    type: "password" | "facebook" | "google" | "apple";
    secret: string;
    salt?: string;
    key: string;
    memberId: number;
    member: Member
}

export const memberIdentitiesSchema = new EntitySchema<MemberIdentity>({
    name: "memberIdentity",
    tableName: "memberIdentities",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        type: {
            type: "varchar",
            nullable: false
        },
        secret: {
            type: "varchar",
            nullable: false
        },
        salt: {
            type: "varchar",
            nullable: true
        },
        key: {
            type: "varchar",
            nullable: false
        },
        memberId: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        member: {
            type: "many-to-one",
            target: "member",
            joinColumn: { name: "memberId" },
            orphanedRowAction: "nullify"
        }
    }
})
