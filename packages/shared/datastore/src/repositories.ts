import { Repository } from "typeorm";
import template from "lodash/template";
import { formatDate } from "date-fns";

import * as entities from "./entities";

export const extendRepositories = {
    //#region [ identity ]
    //#endregion

    //#region [customer profile]
    customers() {
        return {
            async getCustomerById(this: Repository<entities.Customer>, id: number) {
                return this.findOne({
                    where: { id: id },
                    relations: ["customerRelation"]
                }) as Promise<entities.Customer>;
            }
        }
    },
    //#endregion

    //#region [ locations ]
    evses() {
        return {
            async getEvseById(this: Repository<entities.Evse>, id: number) {
                return this.findOne({
                    where: { id: id },
                    relations: ["location", "location.operator"]
                }) as Promise<entities.Evse>;
            },
            async bulkUpdate(this: Repository<entities.Evse>, batch: Record<string, string>[]) {
                // Call stored procedure to update batch of records
                await this.query(
                    'CALL BatchStatusUpdate(?, @updated_count)',
                    [
                        JSON.stringify(batch)
                    ]
                );

                // Get updated count
                const [updatedCountResult] = await this.query(
                    'SELECT @updated_count as updated_count'
                );
                return updatedCountResult.updated_count as number;
            }
        };
    },
    //#endregion

    //#region [ session ]
    sessions() {
        return {
            async getSessionById(this: Repository<entities.Session>, id: number) {
                return this.findOne({
                    where: { id },
                    relations: ["evse", "evse.location", "evse.location.operator"]
                }) as Promise<entities.Session>;
            },
            async getSessionByNumber(this: Repository<entities.Session>, sessionNumber: string) {
                return this.findOne({
                    where: { sessionNumber },
                    relations: ["cdr", "evse", "evse.evseTariffs", "evse.evseTariffs.tariff", "evse.evseTariffs.tariff.tariffFees"]
                }) as Promise<entities.Session>;
            }
        }
    },
    invoices() {
        return {
            async getInvoiceByNumber(this: Repository<entities.Invoice>, invoiceNumber: string) {
                return this.findOne({
                    where: { invoiceNumber },
                    relations: ["invoiceItems"]
                }) as Promise<entities.Invoice>;
            }
        }
    },
    //#endregion

    //#region [ misc ]
    serials() {
        return {
            async newSerial(this: Repository<entities.Serial>, name: string, turnover?: "yearly" | "monthly" | "daily") {
                const serial = await this.findOne({ where: { name } });
                if (serial) {
                    try {
                        if (turnover) {
                            const today = new Date();
                            const lastUpdate = serial.updatedAt;
                            if (turnover === "yearly" && today.getFullYear() > lastUpdate.getFullYear()) {
                                serial.value = 0;
                            }
                            if (turnover === "monthly" && today.getMonth() > lastUpdate.getMonth()) {
                                serial.value = 0;
                            }
                            if (turnover === "daily" && today.getDate() > lastUpdate.getDate()) {
                                serial.value = 0;
                            }
                        }
                        serial.value = serial.value + 1;
                        const compiled = template(serial.format);
                        const generatedSerial = compiled({
                            value: serial.value,
                            date: (format: string) => formatDate(new Date(), format)
                        });
                        await this.save(serial);
                        return generatedSerial;
                    } catch (error) {
                        console.error("Error generating serial:", error);
                    }
                }
                throw new Error("Serial not found");
            }
        }
    }
    //#endregion
}