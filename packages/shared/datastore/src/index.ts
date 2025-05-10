export * from "./entities";
export * from "./entities/shared/enums";
export * from "./datasource";
export { Transaction } from "./types";

//re export operators from typeorm instead of importing typeorm in other projects.
import { Or, ILike, In, Like, Not, IsNull, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
export const operators = {
    Or,
    In,
    Like,
    ILike,
    Not,
    IsNull,
    LessThanOrEqual,
    MoreThanOrEqual
};