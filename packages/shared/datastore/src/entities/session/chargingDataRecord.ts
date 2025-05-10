import { EntitySchema } from "typeorm";
import { Session } from "./session";


export interface ChargingDataRecord {
    id: number,

    startTime: Date,
    endTime: Date,
    consumptionKWH: number,
    durationMinutes: number,
    freeMinutes?: number,
    freeKWH?: number,
    khwCost: number,
    minuteCost: number,
    sessionFee: number,
    tax: number,
    operatorPriceCode: string,
    hubPriceCode: string,
    totalAmount: number, //calculated column
    currency: string,

    sessionId: number,
    session: Session,
}


export const chargingDataRecordsSchema = new EntitySchema<ChargingDataRecord>({
    name: "chargingDataRecord",
    tableName: "chargingDataRecords",
    columns: {
        "id": {
            type: "int",
            generated: "increment",
            primary: true
        },
        "startTime": {
            type: "datetime",
            nullable: false,
        },
        "endTime": {
            type: "datetime",
            nullable: false,
        },
        "consumptionKWH": {
            type: "double",
            nullable: false,
        },
        "durationMinutes": {
            type: "int",
            nullable: false,
        },
        "freeMinutes": {
            type: "int",
            nullable: true,
        },
        "freeKWH": {
            type: "double",
            nullable: true,
        },
        "khwCost": {
            type: "double",
            nullable: true,
        },
        "minuteCost": {
            type: "double",
            nullable: true,
        },
        "sessionFee": {
            type: "double",
            nullable: true,
        },
        "tax": {
            type: "double",
            nullable: false,
        },
        "operatorPriceCode": {
            type: "varchar",
            nullable: true,
        },
        "hubPriceCode": {
            type: "varchar",
            nullable: true,
        },
        "totalAmount": {
            type: "double",
            nullable: false,
        },
        "currency": {
            type: "varchar",
            nullable: false,
        },
        "sessionId": {
            type: "int",
            nullable: false,
        }
    },
    relations: {
        "session": {
            type: "one-to-one",
            target: "session",
            joinColumn: { name: "sessionId" },
            inverseSide: "session",
            cascade: ["insert"]
        }
    }
})