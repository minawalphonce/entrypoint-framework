import { EntitySchema, Double } from "typeorm";
import { EvseTariff } from "./evseTariff";
import { TariffFee } from "./tariffFee";

export interface Tariff {
    id: number,
    name: string,
    taxPercent: number,
    currency: string,
    tariffFees: TariffFee[],
    evseTariffs: EvseTariff[];
}


export const tariffsSchema = new EntitySchema<Tariff>({
    name: "tariff",
    tableName: "tariffs",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        name: {
            type: "varchar",
            nullable: false,
            unique: true
        },
        taxPercent: {
            type: "double",
            nullable: false,
        },
        currency: {
            type: "varchar",
            nullable: false,
        }
    },
    relations: {
        tariffFees: {
            type: "one-to-many",
            target: "tariffFee",
            inverseSide: "tariff",
            cascade: ["insert"]
        },
        evseTariffs: {
            type: "one-to-many",
            target: "evseTariff",
            inverseSide: "tariff"
        }
    }
})