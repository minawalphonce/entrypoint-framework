import { createHash } from 'crypto';

export function hash(value: string) {
    const sha256 = createHash("sha256");
    return sha256.update(value).digest("hex");
}