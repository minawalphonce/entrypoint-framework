import { EntitySchema } from "typeorm";

import { TariffFee } from "./tariffFee";

export interface TariffFeeSchedule {
    id: number,
    day: string,
    from: number,
    to: number,
    tariffFeeId: number,
    tariffFee: TariffFee
}

export const tariffFeeSchedulesSchema = new EntitySchema<TariffFeeSchedule>({
    name: "tariffFeeSchedule",
    tableName: "tariffFeeSchedules",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        tariffFeeId: {
            type: "int",
            nullable: false
        },
        day: {
            type: "varchar",
            nullable: false,
        },
        from: {
            type: "double",
            nullable: false,
        },
        to: {
            type: "double",
            nullable: false,
        }
    },
    relations: {
        tariffFee: {
            type: "many-to-one",
            target: "tariffFee",
            joinColumn: { name: "tariffFeeId" }
        }
    }
})