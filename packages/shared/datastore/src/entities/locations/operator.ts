import { EntitySchema } from "typeorm";
import { OperatorProvider } from "../shared";
import { OperatorContract } from "./operatorContracts";

export interface Operator {
    id: number,
    name: string,
    sourceOperatorId: string,
    parentOperatorName?: string,
    contactInformation: string,
    provider: OperatorProvider,
    locations: Location[],
    contracts: OperatorContract[]
}

export const operatorsSchema = new EntitySchema<Operator>({
    name: "operator",
    tableName: "operators",
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
        sourceOperatorId: {
            type: "varchar",
            nullable: false
        },
        parentOperatorName: {
            type: "varchar",
            nullable: true
        },
        contactInformation: {
            type: "varchar",
            nullable: true
        },
        provider: {
            type: "simple-enum",
            enum: OperatorProvider,
            nullable: false,
        }
    },
    relations: {
        locations: {
            target: 'location',
            type: 'one-to-many',
            inverseSide: 'operator',
        },
        contracts: {
            target: 'operatorContract',
            type: 'one-to-many',
            inverseSide: 'operator',
            cascade: ["insert"]
        }
    }
})