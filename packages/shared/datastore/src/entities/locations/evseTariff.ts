import { EntitySchema } from "typeorm";
import { Evse } from "./evse";
import { Tariff } from "./tariff";

// TODO: add user segmenetation so single evse can have multiple tariffs based on user segment
export interface EvseTariff {
    id: number,
    tariffId: number,
    evseId: number,
    evse: Evse,
    tariff: Tariff
}

export const evseTariffsSchema = new EntitySchema<EvseTariff>({
    name: "evseTariff",
    tableName: "evseTariffs",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        tariffId: {
            type: "int",
            nullable: false
        },
        evseId: {
            type: "int",
            nullable: false,
        }
    },
    relations: {
        evse: {
            type: "many-to-one",
            target: "evse",
            joinColumn: { name: "evseId" }
        },
        tariff: {
            type: "many-to-one",
            target: "tariff",
            joinColumn: { name: "tariffId" }
        }
    }
})