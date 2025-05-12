import { EntitySchema } from "typeorm";

import { Auditable, enableAudit } from "../shared";

export interface Serial extends Auditable {
    id: number,
    name: string,
    value: number,
    format: string
}

export const serialsSchema = new EntitySchema<Serial>({
    name: "serial",
    tableName: "serials",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        name: {
            type: "varchar",
            nullable: false
        },
        value: {
            type: "int",
            nullable: false,
        },
        format: {
            type: "varchar",
            nullable: false
        },
        ...enableAudit()
    }
});