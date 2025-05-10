import { EntitySchema } from "typeorm";
import { Invoice } from "./invoice";
import { TariffFeeUnit } from "../shared";

export interface InvoiceItem {
    id: number,
    invoiceId: number,

    name: string,
    unit: TariffFeeUnit,
    unitPrice: number,
    priority: number,
    quantity: number,
    invoice: Invoice,

    //virtual
    amount?: number
}


export const invoiceItemsSchema = new EntitySchema<InvoiceItem>({
    name: "invoiceItem",
    tableName: "invoiceItems",
    columns: {
        "id": {
            type: "int",
            generated: "increment",
            primary: true
        },
        "invoiceId": {
            type: "int",
            nullable: false,
        },
        "name": {
            type: "varchar",
            nullable: false,
        },
        "unit": {
            type: "simple-enum",
            enum: TariffFeeUnit,
            nullable: false,
            comment: "Unit of the tariff fee can be hour / min / sec / kwh / fixed / percent"
        },
        "unitPrice": {
            type: "double",
            nullable: false,
        },
        "priority": {
            type: "int",
            nullable: true,
            comment: "Priority of the tariff fee, if there are multiple tariff fees, the one with the highest priority will be charged first"
        },
        "quantity": {
            type: "double",
            nullable: false,
        },
    },
    relations: {
        invoice: {
            type: "many-to-one",
            target: "invoice",
            joinColumn: { name: "invoiceId" }
        }
    }
})