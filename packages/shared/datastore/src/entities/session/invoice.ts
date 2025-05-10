import { EntitySchema } from "typeorm";

import { PaymentStatus, Auditable, enableAudit, PaymentType } from "../shared";
import { InvoiceItem } from "./invoiceItem";
import { Vehicle } from "../profiles/vehicle";
import { Evse } from "../locations/evse";
import { Session } from "./session";

export interface Invoice extends Auditable {
    id: number,
    invoiceNumber: string,
    evseId: number,
    vehicleId: number,

    last4Digits?: string,
    paymentType: PaymentType
    paymentStatus: PaymentStatus,
    taxAmount: number,
    amount: number,
    pspRefId?: string,

    vehicle: Vehicle,
    evse: Evse
    invoiceItems: InvoiceItem[],

    session: Session
}


export const invoicesSchema = new EntitySchema<Invoice>({
    name: "invoice",
    tableName: "invoices",
    columns: {
        "id": {
            type: "int",
            generated: "increment",
            primary: true
        },
        "invoiceNumber": {
            type: "varchar",
            nullable: false
        },
        "evseId": {
            type: "int",
            nullable: false
        },
        "vehicleId": {
            type: "int",
            nullable: false,
        },
        "last4Digits": {
            type: "varchar",
            nullable: true
        },
        "paymentType": {
            type: "simple-enum",
            enum: PaymentType,
            nullable: false
        },
        "paymentStatus": {
            type: "simple-enum",
            enum: PaymentStatus,
            nullable: false
        },
        "taxAmount": {
            type: "double",
            nullable: false
        },
        "amount": {
            type: "double",
            nullable: false,
        },
        "pspRefId": {
            type: "varchar",
            nullable: true
        },
        ...enableAudit()
    },
    relations: {
        invoiceItems: {
            type: "one-to-many",
            target: "invoiceItem",
            inverseSide: "invoice"
        },
        evse: {
            type: "many-to-one",
            target: "evse",
            joinColumn: { name: "evseId" }
        },
        vehicle: {
            type: "many-to-one",
            target: "vehicle",
            joinColumn: { name: "vehicleId" }
        },
        session: {
            type: "one-to-one",
            target: "session",
            inverseSide: "invoice",
        }
    }
})