"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("./util/assert");
const ecc = require("./util/ecc");
const bech32 = require("./util/bech32");
const serializedPrefix = 'bshi'; // blinded signature hookedin
class BlindedSignature {
    static fromBech(str) {
        const { prefix, words } = bech32.decode(str);
        if (prefix !== serializedPrefix) {
            throw new Error('Got prefix: ' + prefix + ' but expected ' + serializedPrefix);
        }
        return BlindedSignature.fromBytes(bech32.fromWords(words));
    }
    static fromBytes(bytes) {
        assert.equal(bytes.length, 32);
        const s = ecc.Scalar.fromBytes(bytes);
        if (s instanceof Error) {
            return s;
        }
        return new BlindedSignature(s);
    }
    constructor(s) {
        this.s = s;
    }
    get buffer() {
        return ecc.Scalar.toBytes(this.s);
    }
    toBech() {
        return bech32.encode(serializedPrefix, bech32.toWords(this.buffer));
    }
}
exports.default = BlindedSignature;
//# sourceMappingURL=blinded-signature.js.map