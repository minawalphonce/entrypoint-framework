import { EntitySchema } from "typeorm";
import { Vehicle } from "../profiles/vehicle";
import { Evse } from "../locations/evse";
import { SessionStatus } from "../shared";
import { ChargingDataRecord } from "./chargingDataRecord";
import { Invoice } from "./invoice";

export interface Session {
    id: number,

    evseId: number,
    vehicleId: number,
    startTime: Date,
    endTime?: Date,

    progressKwh: number,
    lastUpdate: Date,
    requestedKwh: number,

    hubSessionId?: string,
    operatorSessionId?: string,

    invoiceId?: number,

    pspRefId: string,
    authorizedAmount: number,

    status: SessionStatus,

    sessionNumber: string,

    error?: string,

    vehicle: Vehicle,
    evse: Evse,
    cdr: ChargingDataRecord,
    invoice: Invoice
}


export const sessionsSchema = new EntitySchema<Session>({
    name: "session",
    tableName: "sessions",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        pspRefId: {
            type: "varchar",
            nullable: true
        },
        vehicleId: {
            type: "int",
            nullable: true
        },
        evseId: {
            type: "int",
            nullable: true,
        },
        startTime: {
            type: "datetime",
            nullable: false,
        },
        endTime: {
            type: "datetime",
            nullable: true,
        },
        progressKwh: {
            type: "double",
            nullable: true
        },
        lastUpdate: {
            type: "datetime",
            nullable: true
        },
        requestedKwh: {
            type: "double",
            nullable: true
        },
        hubSessionId: {
            type: "varchar",
            nullable: true,
        },
        operatorSessionId: {
            type: "varchar",
            nullable: true,
        },
        invoiceId: {
            type: "int",
            nullable: true
        },
        authorizedAmount: {
            type: "double",
            nullable: true
        },
        status: {
            type: "simple-enum",
            enum: SessionStatus,
            nullable: false,
        },
        sessionNumber: {
            type: "varchar",
            nullable: false,
            comment: "Custom session id"
        },
        error: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        vehicle: {
            type: "many-to-one",
            target: "vehicle",
            joinColumn: { name: "vehicleId" }
        },
        evse: {
            type: "many-to-one",
            target: "evse",
            joinColumn: { name: "evseId" }
        },
        cdr: {
            target: "chargingDataRecord",
            type: 'one-to-one',
            inverseSide: 'session',
            cascade: ["insert"]
        },
        invoice: {
            type: "one-to-one",
            target: "invoice",
            joinColumn: { name: "invoiceId" },
        }
    }
});