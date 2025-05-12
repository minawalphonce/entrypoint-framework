import { EntitySchemaColumnOptions } from "typeorm"

export interface Deletable {
    deletedAt?: Date
}


export function enableSoftDelete() {
    return {
        "deletedAt": {
            type: "datetime",
            deleteDate: true
        } as EntitySchemaColumnOptions
    }
}