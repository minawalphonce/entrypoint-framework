export type NativeType = string | number | boolean;

export type Claims = Record<string, NativeType>;

export interface GrantResolver {
    (body: Record<string, string>): Promise<Claims | null> | Claims | null,
    memberAccessTokenEnabled?: boolean
}

const grants: Record<string, GrantResolver[]> = {};

export function register(grantType: string, resolvers: GrantResolver[]) {
    grants[grantType] = resolvers;
}

export async function validate(grantType: string, req: Record<string, string>): Promise<Record<string, string>> {
    const validators = grants[grantType];
    if (!validators) {
        throw { error: "ERR_INVALID_GRANT", grant: grantType };
    }
    let claims = {};
    for (const vldr of validators) {
        try {
            const resultingClaims = await vldr(req);
            claims = {
                ...claims,
                ...resultingClaims
            }
        }
        catch (err) {
            throw err;
        }
    }

    return claims;
}