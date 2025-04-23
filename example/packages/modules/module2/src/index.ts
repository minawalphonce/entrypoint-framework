import { HttpFunctionContext } from "@@cloudecore";

export function getMe(ctx: HttpFunctionContext) {

    ctx.success({
        message: 'Hello from module2 -> getMe'
    });
}

export function setMe(ctx: HttpFunctionContext) {
    console.info('getMe from module2');
    ctx.error({
        msg: 'Error from module2 -> SetMe'
    });
}