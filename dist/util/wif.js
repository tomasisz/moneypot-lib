"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bs58check = require("./bs58check");
function decodeRaw(buffer, version) {
    // check version only if defined
    if (version !== undefined && buffer[0] !== version) {
        throw new Error('Invalid network version');
    }
    // uncompressed
    if (buffer.length === 33) {
        return {
            version: buffer[0],
            privateKey: buffer.slice(1, 33),
            compressed: false,
        };
    }
    // invalid length
    if (buffer.length !== 34) {
        throw new Error('Invalid WIF length');
    }
    // invalid compression flag
    if (buffer[33] !== 0x01) {
        throw new Error('Invalid compression flag');
    }
    return {
        version: buffer[0],
        privateKey: buffer.slice(1, 33),
        compressed: true,
    };
}
exports.decodeRaw = decodeRaw;
function encodeRaw(version, privateKey, compressed = true) {
    const result = new Uint8Array(compressed ? 34 : 33);
    result[0] = version;
    result.set(privateKey, 1);
    if (compressed) {
        result[33] = 0x01;
    }
    return result;
}
exports.encodeRaw = encodeRaw;
async function decode(str, version) {
    return decodeRaw(await bs58check.decode(str), version);
}
exports.decode = decode;
function encode(version, privateKey, compressed = true) {
    return bs58check.encode(encodeRaw(version, privateKey, compressed));
}
exports.encode = encode;
//# sourceMappingURL=wif.js.map