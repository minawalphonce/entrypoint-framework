import { EntitySchema } from "typeorm";

import { TariffFeeUnit } from "../shared";
import { Tariff } from "./tariff";
import { TariffFeeSchedule } from "./tariffFeeSchedule";
import { InvoiceItem } from "../session/invoiceItem";


export interface TariffFee {
    id: number,
    name: string,
    price: number,
    unit: TariffFeeUnit,
    minUnit?: number,
    maxUnit?: number,
    priority: number,
    tariffId: number,

    tariff: Tariff,
    tariffFeeSchedules: TariffFeeSchedule[],
    invoiceItem: InvoiceItem
}


export const tariffFeesSchema = new EntitySchema<TariffFee>({
    name: "tariffFee",
    tableName: "tariffFees",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        tariffId: {
            type: "int",
            nullable: false,
            comment: "Id of the tariff to which this fee belongs"
        },
        name: {
            type: "varchar",
            nullable: false,
            comment: "Name of the tariff fee, that will be displayed in the invoice"
        },
        price: {
            type: "double",
            nullable: false,
            comment: "Price per unit of the tariff fee"
        },
        unit: {
            type: "simple-enum",
            enum: TariffFeeUnit,
            nullable: false,
            comment: "Unit of the tariff fee can be hour / min / sec / kwh / fixed / percent"
        },
        minUnit: {
            type: "double",
            nullable: true,
            comment: "minimum unit of the tariff fee, e.g. minUnit = 10 and unit = min, then if quantity is 5, 10 will be charged"
        },
        maxUnit: {
            type: "double",
            nullable: true,
            comment: "maximum unit of the tariff fee, e.g. maxUnit = 10 and unit = min, then if quantity is 15, 10 will be charged"
        },
        priority: {
            type: "int",
            nullable: false,
            comment: "Priority of the tariff fee, if there are multiple tariff fees, the one with the highest priority will be charged first"
        },
    },
    relations: {
        tariff: {
            type: "many-to-one",
            target: "tariff",
            joinColumn: { name: "tariffId" },
            cascade: ["insert"]
        },
        tariffFeeSchedules: {
            type: "one-to-many",
            target: "tariffFeeSchedule",
            inverseSide: "tariffFee"
        },
        invoiceItem: {
            type: "one-to-one",
            target: "invoiceItem"
        }
    }
})