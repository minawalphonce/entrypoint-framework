import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export function createAccessToken(
    claims: Record<string, string>,
    privateKey: string,
    expiresIn: string = "1h"
) {
    return jwt.sign(claims, privateKey, {
        audience: ["*"],
        expiresIn,
        notBefore: "100ms",
        jwtid: Date.now().toString(),
        issuer: "vcg-identity"
    })
}

export function createRefreshToken() {
    return uuidv4();
}

export function decode(token: string) {
    return jwt.decode(token);
}

export function verify(token: string, privateKey: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, {
            audience: ["*"],
            issuer: "vcg-identity",
            ignoreExpiration: false,
        }, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
}