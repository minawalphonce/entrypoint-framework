import { EntitySchema } from "typeorm";

import { Session } from "../session/session";
import { Connector, enableSoftDelete } from "../shared";
import { Customer } from "./customer";

export interface Vehicle {
    id: number,
    customerId: number,
    brand: string,
    model: string,
    shape: string,
    size: string,
    year: number,
    connectors: Connector[],
    license: string,
    name: string,
    customer: Customer,
    sessions: Session[]
}

export const vehiclesSchema = new EntitySchema<Vehicle>({
    name: "vehicle",
    tableName: "vehicles",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        customerId: {
            type: "int",
            nullable: false
        },
        brand: {
            type: "varchar",
            nullable: false
        },
        model: {
            type: "varchar",
            nullable: false
        },
        shape: {
            type: "varchar",
            nullable: true
        },
        size: {
            type: "varchar",
            nullable: true
        },
        year: {
            type: "int",
            nullable: true
        },
        connectors: {
            type: "text",
            nullable: false,
            transformer: {
                from: (value: string) => {
                    return value
                        ? value.split(',')
                        : null;
                },
                to: (value: Connector[]) => {
                    return value
                        ? value.sort().join(',')
                        : null;
                }
            }
        },
        license: {
            type: "varchar",
            nullable: false
        },
        name: {
            type: "varchar",
            nullable: true
        },
        ...enableSoftDelete()
    },
    relations: {
        customer: {
            type: "many-to-one",
            target: "customer",
            joinColumn: { name: "customerId" }

        },
        sessions: {
            type: "one-to-many",
            target: "session",
            inverseSide: "vehicle"
        }
    }
});