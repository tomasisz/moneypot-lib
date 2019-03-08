"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimed_coin_1 = require("./claimed-coin");
const assert = require("./util/assert");
const hash_1 = require("./hash");
const buffutils = require("./util/buffutils");
class ClaimedCoinSet {
    static fromPOD(data) {
        if (!Array.isArray(data)) {
            return new Error('ClaimedCoinSet was expecting an array');
        }
        const inputs = [];
        for (const input of data) {
            const cc = claimed_coin_1.default.fromPOD(input);
            if (cc instanceof Error) {
                return cc;
            }
            inputs.push(cc);
        }
        return new ClaimedCoinSet(inputs);
    }
    constructor(inputs) {
        this.coins = inputs;
    }
    [Symbol.iterator]() {
        return this.coins[Symbol.iterator]();
    }
    get amount() {
        let sum = 0;
        for (const coin of this.coins) {
            sum += 2 ** coin.magnitude;
        }
        return sum;
    }
    get(n) {
        assert.equal(n >= 0, true);
        assert.equal(n < this.length, true);
        return this.coins[n];
    }
    // modifies the coins.
    canonicalize() {
        this.coins.sort(compare);
    }
    get length() {
        return this.coins.length;
    }
    toPOD() {
        assert.equal(this.isCanonicalized(), true);
        return this.coins.map(i => i.toPOD());
    }
    hash() {
        this.canonicalize();
        const h = hash_1.default.newBuilder('ClaimedCoinSet');
        for (const input of this.coins) {
            h.update(input.hash().buffer);
        }
        return h.digest();
    }
    isCanonicalized() {
        for (let i = 1; i < this.coins.length; i++) {
            if (compare(this.coins[i - 1], this.coins[i]) > 0) {
                return false;
            }
        }
        return true;
    }
}
exports.default = ClaimedCoinSet;
function compare(a, b) {
    const r = a.magnitude - b.magnitude;
    if (r !== 0) {
        return r;
    }
    return buffutils.compare(a.owner.buffer, b.owner.buffer);
}
//# sourceMappingURL=claimed-coin-set.js.map