import { EntitySchema } from "typeorm"
import { Operator } from "./operator"

export interface OperatorContract {
    id: number,
    operatorId: number,

    startDate: Date,
    endDate: Date,
    isDisabled: boolean,
    isActive: boolean, //calculated column

    operatorPriceId?: string,
    hubPriceId?: string

    kwhPrice: number,
    minutePrice: number,
    sessionPrice: number,
    freeKwh: number,
    freeMinutes: number,
    currency: string,
    taxPercent: number,

    operator: Operator
}

export const operatorContractsSchema = new EntitySchema<OperatorContract>({
    name: "operatorContract",
    tableName: "operatorContracts",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        operatorId: {
            type: "int",
            nullable: false
        },
        startDate: {
            type: "datetime",
            nullable: false
        },
        endDate: {
            type: "datetime",
            nullable: false
        },
        isDisabled: {
            type: "boolean",
            nullable: false
        },
        operatorPriceId: {
            type: "varchar",
            nullable: true
        },
        hubPriceId: {
            type: "varchar",
            nullable: true
        },
        kwhPrice: {
            type: "double",
            nullable: false,
            default: 0.0
        },
        minutePrice: {
            type: "double",
            nullable: false,
            default: 0.0
        },
        sessionPrice: {
            type: "double",
            nullable: false,
            default: 0.0
        },
        freeKwh: {
            type: "int",
            nullable: false,
            default: 0
        },
        freeMinutes: {
            type: "int",
            nullable: false,
            default: 0
        },
        currency: {
            type: "varchar",
            nullable: false
        },
        taxPercent: {
            type: "double",
            nullable: false
        }
    },
    relations: {
        operator: {
            type: "many-to-one",
            target: "operator",
            joinColumn: { name: "operatorId" }
        },
    }
});
