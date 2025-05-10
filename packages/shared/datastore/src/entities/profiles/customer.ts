import { EntitySchema } from "typeorm";
import { CustomerRelation } from "./customer-relation";
import { Vehicle } from "./vehicle";

import { enableAudit, Auditable } from "../shared/audit";
import { Invoice } from "../session/invoice";

export interface Customer extends Auditable {
    id: number,
    displayName: string,
    profilePictureUrl?: string,
    mobile?: string,
    email: string,

    customerRelation: CustomerRelation,
    vehicles: Vehicle[],
    invoices: Invoice[]
}

export const customersSchema = new EntitySchema<Customer>({
    name: "customer",
    tableName: "customers",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        displayName: {
            type: "varchar",
            nullable: false
        },
        profilePictureUrl: {
            type: "varchar",
            nullable: true
        },
        mobile: {
            type: "varchar",
            nullable: true
        },
        email: {
            type: "varchar",
            nullable: true
        },
        ...enableAudit()
    },
    relations: {
        customerRelation: {
            target: 'customerRelation',
            type: 'one-to-one',
            inverseSide: 'customer',
            cascade: ["insert"]
        },
        vehicles: {
            target: 'vehicles',
            type: 'one-to-many',
            inverseSide: 'customer'
        },
        invoices: {
            target: 'invoice',
            type: 'one-to-many'
        }
    }
})