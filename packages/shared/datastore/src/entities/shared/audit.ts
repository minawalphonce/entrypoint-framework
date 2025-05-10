import { EntitySchemaColumnOptions } from "typeorm";

export interface Auditable {
    createdAt: Date,
    updatedAt: Date,
}

export interface SystemAuditable {
    createdBy: string,
    createdAt: Date,
    updatedBy: string,
    updatedAt: Date,
}

export function enableAudit() {
    return {
        "createdAt": {
            type: "datetime",
            createDate: true,
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        } as EntitySchemaColumnOptions,
        "updatedAt": {
            type: "datetime",
            updateDate: true,
            nullable: true,
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        } as EntitySchemaColumnOptions
    }
}

export function enableSystemAudit() {
    return {
        "createdBy": {
            type: "varchar",
            nullable: true
        } as EntitySchemaColumnOptions,
        "updatedBy": {
            type: "varchar",
            nullable: true
        } as EntitySchemaColumnOptions,
        "createdAt": {
            type: "datetime",
            createDate: true,
            nullable: false,
            default: () => "CURRENT_TIMESTAMP"
        } as EntitySchemaColumnOptions,
        "updatedAt": {
            type: "datetime",
            updateDate: true,
            nullable: true,
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP"
        } as EntitySchemaColumnOptions
    }
}