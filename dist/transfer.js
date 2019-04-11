"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./hash");
const signature_1 = require("./signature");
const coin_1 = require("./coin");
const ecc_1 = require("./util/ecc");
const public_key_1 = require("./public-key");
const buffutils = require("./util/buffutils");
class Transfer {
    static fromPOD(data) {
        if (typeof data !== 'object') {
            return new Error('expected an object to deserialize a Transfer');
        }
        const inputs = [];
        for (const i of data.inputs) {
            const input = coin_1.default.fromPOD(i);
            if (input instanceof Error) {
                return input;
            }
            inputs.push(input);
        }
        const bountyHashes = [];
        for (const b of data.bountyHashes) {
            const bounty = hash_1.default.fromBech(b);
            if (bounty instanceof Error) {
                return bounty;
            }
            bountyHashes.push(bounty);
        }
        const hookoutHash = data.hookout ? hash_1.default.fromBech(data.hookoutHash) : undefined;
        if (hookoutHash instanceof Error) {
            return hookoutHash;
        }
        const authorization = signature_1.default.fromBech(data.authorization);
        if (authorization instanceof Error) {
            return authorization;
        }
        return new Transfer(inputs, bountyHashes, hookoutHash, authorization);
    }
    constructor(inputs, bountyHashes, hookoutHash, authorization) {
        this.inputs = hashSort(inputs);
        this.bountyHashes = sort(bountyHashes);
        this.hookoutHash = hookoutHash;
        this.authorization = authorization;
    }
    static hashOf(inputs, bounties, hookout) {
        const h = hash_1.default.newBuilder('Transfer');
        for (const input of sort(inputs)) {
            h.update(input.buffer);
        }
        for (const bounty of sort(bounties)) {
            h.update(bounty.buffer);
        }
        if (hookout) {
            h.update(hookout.buffer);
        }
        return h.digest();
    }
    hash() {
        return Transfer.hashOf(this.inputs.map(i => i.hash()), this.bountyHashes, this.hookoutHash ? this.hookoutHash : undefined);
    }
    toPOD() {
        return {
            authorization: this.authorization.toBech(),
            bountyHashes: this.bountyHashes.map(b => b.toBech()),
            hookoutHash: this.hookoutHash ? this.hookoutHash.toBech() : undefined,
            inputs: this.inputs.map(i => i.toPOD()),
        };
    }
    isValid() {
        const p = ecc_1.muSig.pubkeyCombine(this.inputs.map(coin => coin.owner));
        const pubkey = new public_key_1.default(p.x, p.y);
        return this.authorization.verify(this.hash().buffer, pubkey);
    }
}
exports.default = Transfer;
// TODO: these sort can be optimized to check if it's already sorted, if so, just return original
function hashSort(ts) {
    return [...ts].sort((a, b) => buffutils.compare(a.hash().buffer, b.hash().buffer));
}
function sort(ts) {
    return [...ts].sort((a, b) => buffutils.compare(a.buffer, b.buffer));
}
//# sourceMappingURL=transfer.js.map