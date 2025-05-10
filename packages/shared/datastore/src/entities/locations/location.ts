import { EntitySchema } from "typeorm";

import { Operator } from "./operator";
import { Evse } from "./evse";
import { local, enableSoftDelete, Deletable, enableSystemAudit, SystemAuditable, ParkingType, ParkingAccessibility } from "../shared";
import { LocationImage } from "./locationImage";

export interface Location extends Deletable, SystemAuditable {
    id: number,
    sourceId: string,
    name?: string,
    country?: string,
    city?: string,
    region?: string,
    street?: string,
    houseNumber?: string,
    postalCode?: string,
    addressNote?: string,
    geoCoordinateLat: number,
    geoCoordinateLong: number,
    geoCoordinatePoint: string,
    parkingAccessibility?: ParkingAccessibility,
    parkingType?: ParkingType,
    note?: string,
    openingHours: string,
    isOpen24Hours?: boolean,
    operatorId: number,

    operator: Operator,
    evses: Evse[],
    images: LocationImage[]
}

export const locationsSchema = new EntitySchema<Location>({
    name: "location",
    tableName: "locations",
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
        sourceId: {
            type: "varchar",
            nullable: false
        },
        name: {
            type: "varchar",
            nullable: true
        },
        country: {
            type: "varchar",
            nullable: true
        },
        city: {
            type: "varchar",
            nullable: true
        },
        region: {
            type: "varchar",
            nullable: true
        },
        street: {
            type: "varchar",
            nullable: true
        },
        houseNumber: {
            type: "varchar",
            nullable: true
        },
        postalCode: {
            type: "varchar",
            nullable: true
        },
        addressNote: {
            type: "varchar",
            nullable: true
        },
        parkingAccessibility: {
            type: "simple-enum",
            enum: ParkingAccessibility,
            nullable: true
        },
        parkingType: {
            type: "simple-enum",
            enum: ParkingType,
            nullable: true
        },
        geoCoordinateLat: {
            type: "double",
            nullable: false
        },
        geoCoordinateLong: {
            type: "double",
            nullable: false
        },
        geoCoordinatePoint: {
            type: local("point", "varchar"),
            nullable: true,
            generatedType: local("STORED", undefined),
            update: false
        },
        note: {
            type: "varchar",
            nullable: true
        },
        openingHours: {
            type: "json",
            nullable: true
        },
        isOpen24Hours: {
            type: "boolean",
            nullable: true
        },
        ...enableSoftDelete(),
        ...enableSystemAudit()
    },
    relations: {
        operator: {
            type: "many-to-one",
            target: "operator",
            joinColumn: { name: "operatorId" },
        },
        evses: {
            type: 'one-to-many',
            target: 'evse',
            inverseSide: 'location',
            cascade: ["insert"]
        },
        images: {
            type: "one-to-many",
            target: "locationImage",
            inverseSide: "location"
        }
    }
})