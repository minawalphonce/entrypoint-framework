import { EntitySchema } from "typeorm";
import { Location } from "./location";


export interface LocationImage {
    id: number,
    url: string,
    hash: string,
    locationId: number,
    location: Location
}

export const locationImagesSchema = new EntitySchema<LocationImage>({
    name: "locationImage",
    tableName: "locationImages",
    columns: {
        id: {
            type: "int",
            generated: "increment",
            primary: true
        },
        url: {
            type: "varchar",
            nullable: false
        },
        hash: {
            type: "varchar",
            nullable: false
        },
        locationId: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        location: {
            type: "many-to-one",
            target: "locations",
            joinColumn: { name: "locationId" }
        }
    }
});