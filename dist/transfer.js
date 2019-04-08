"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const signature_1 = require("./signature");
const hset_1 = require("./hset");
const coin_1 = require("./coin");
const ecc_1 = require("./util/ecc");
const public_key_1 = require("./public-key");
class Transfer {
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('expected an object to deserialize a Transfer');
        }
        const inputs = hset_1.default.fromPOD(data.inputs, coin_1.default.fromPOD);
        if (inputs instanceof Error) {
            return inputs;
        }
        const bountiesHash = hash_1.default.fromBech(data.bountiesHash);
        if (bountiesHash instanceof Error) {
            return bountiesHash;
        }
        const hookoutHash = data.hookout ? hash_1.default.fromBech(data.hookoutHash) : undefined;
        if (hookoutHash instanceof Error) {
            return hookoutHash;
        }
        const authorization = signature_1.default.fromBech(data.authorization);
        if (authorization instanceof Error) {
            return authorization;
        }
        return new Transfer(inputs, bountiesHash, hookoutHash, authorization);
    }
    constructor(inputs, bountiesHash, hookoutHash, authorization) {
        this.inputs = inputs;
        this.bountiesHash = bountiesHash;
        this.hookoutHash = hookoutHash;
        this.authorization = authorization;
    }
    static hashOf(inputs, bounties, hookout) {
        const h = hash_1.default.newBuilder('Transfer');
        h.update(inputs.buffer);
        h.update(bounties.buffer);
        h.update(hookout ? hookout.buffer : new Uint8Array(32));
        return h.digest();
    }
    hash() {
        return Transfer.hashOf(this.inputs.hash(), this.bountiesHash, this.hookoutHash ? this.hookoutHash : undefined);
    }
    toPOD() {
        return {
            authorization: this.authorization.toBech(),
            bountiesHash: this.bountiesHash.toBech(),
            hookoutHash: this.hookoutHash ? this.hookoutHash.toBech() : undefined,
            inputs: this.inputs.toPOD(),
        };
    }
    isValid() {
        const p = ecc_1.muSig.pubkeyCombine(this.inputs.entries.map(coin => coin.owner));
        const pubkey = new public_key_1.default(p.x, p.y);
        return this.authorization.verify(this.hash().buffer, pubkey);
    }
}
exports.default = Transfer;
//# sourceMappingURL=transfer.js.map