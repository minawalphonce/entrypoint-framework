import crypto from "crypto"

export async function secure(password: string): Promise<{
    securedPassword: string,
    salt: string
}> {
    // Creating a unique salt for a particular user 
    const salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations, 
    const hash = crypto.pbkdf2Sync(password, salt,
        1000, 64, `sha512`).toString(`hex`);

    return {
        salt,
        securedPassword: hash
    }
}

export async function validate(securedPassword: string, password: string, salt: string): Promise<Boolean> {
    var hash = crypto.pbkdf2Sync(password,
        salt, 1000, 64, `sha512`).toString(`hex`);
    return securedPassword === hash;
}