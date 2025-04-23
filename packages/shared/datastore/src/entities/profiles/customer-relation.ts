import { EntitySchema } from "typeorm";
import { Customer } from "./customer";

export interface CustomerRelation {
    id: number,
    oauthId?: string,
    pspId?: string,
    evcoId?: string,
    idTag?: string,
    customerId: number,
    customer: Customer
}


export const customerRelationsSchema = new EntitySchema<CustomerRelation>({
    name: "customerRelation",
    tableName: "customerRelations",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        oauthId: {
            type: "varchar",
            nullable: true
        },
        pspId: {
            type: "varchar",
            nullable: true
        },
        evcoId: {
            type: "varchar",
            nullable: true
        },
        idTag: {
            type: "varchar",
            nullable: true,
            comment: "A driver identifier that is sent in the start/stop session for SaasCharge"
        },
        customerId: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        customer: {
            type: "one-to-one",
            target: "customer",
            joinColumn: { name: "customerId" },
            inverseSide: "customerRelation",
            cascade: ["insert"]
        }
    }
})