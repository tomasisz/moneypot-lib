import { Point } from '.';
export declare type Signature = {
    r: bigint;
    s: bigint;
};
export declare const Signature: {
    fromBytes(buf: Uint8Array): Error | Signature;
    fromHex(hex: string): Error | Signature;
    toBytes({ r, s }: Signature): Uint8Array;
    toHex(sig: Signature): string;
};
export declare function sign(message: Uint8Array, privkey: bigint): Signature;
export declare function verify(pubkey: Point, message: Uint8Array, sig: Signature): boolean;
