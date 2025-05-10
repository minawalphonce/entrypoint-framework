import { EntitySchema } from "typeorm";

import { SystemAuditable, enableSystemAudit, Deletable, enableSoftDelete, PowerType, EVSEStatus, Connector } from "../shared";
import type { EvseTariff } from "./evseTariff";
import type { Location } from "./location";
import { Session } from "../session/session";

export interface Evse extends SystemAuditable, Deletable {
    id: number,
    sourceEvseId: string,
    sourceSocketId?: number,
    manufacturer?: string,
    power: number,
    powerType: "AC" | "DC",
    isCompatible: boolean,
    isCableAttached: boolean,
    connectors: Connector[],
    geoCoordinateLat: number,
    geoCoordinateLong: number,
    status?: EVSEStatus,
    lastUpdatedAtSource: Date,
    lastStatusUpdate?: Date,
    locationId: number,
    location: Location,
    evseTariffs: EvseTariff[];
    sessions: Session[];
}

export const evsesSchema = new EntitySchema<Evse>({
    name: "evse",
    tableName: "evses",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        sourceEvseId: {
            type: "varchar",
            nullable: false
        },
        manufacturer: {
            type: "varchar",
            nullable: true
        },
        power: {
            type: "double",
            nullable: false
        },
        powerType: {
            type: "simple-enum",
            nullable: false,
            enum: PowerType
        },
        isCompatible: {
            type: "boolean",
            nullable: false
        },
        isCableAttached: {
            type: "boolean",
            nullable: false
        },
        connectors: {
            type: "text",
            nullable: false,
            transformer: {
                from: (value: string) => {
                    return value
                        ? value.split(',')
                        : value;
                },
                to: (value: Connector[]) => {
                    return Array.isArray(value)
                        ? value.sort().join(',')
                        : value;
                }
            }
        },
        geoCoordinateLat: {
            type: "double",
            nullable: false
        },
        geoCoordinateLong: {
            type: "double",
            nullable: false
        },
        status: {
            type: "simple-enum",
            enum: EVSEStatus,
            nullable: true,
        },
        sourceSocketId: {
            type: "int",
            nullable: true
        },
        lastUpdatedAtSource: {
            type: "datetime",
            nullable: false
        },
        lastStatusUpdate: {
            type: "datetime",
            nullable: true
        },
        locationId: {
            type: "int",
            nullable: false
        },
        ...enableSystemAudit(),
        ...enableSoftDelete()
    },
    relations: {
        location: {
            type: "many-to-one",
            target: "location",
            joinColumn: { name: "locationId" }
        },
        evseTariffs: {
            type: "one-to-many",
            target: "evseTariff",
            inverseSide: "evse"
        },
        sessions: {
            type: "one-to-many",
            target: "session",
            inverseSide: "evse"
        }
    }
});