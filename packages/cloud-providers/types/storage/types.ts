import type { Readable } from 'node:stream';

export type Content = Readable | Buffer;
export type Options = {
    streamEnabled: boolean,
}

export type Storage = {
    remove(source: string, url: string): Promise<boolean>;
    write(source: string, url: string, body: Content): Promise<{ url: string }>;
    read(source: string, url: string, options?: Options): Promise<Content>;
}