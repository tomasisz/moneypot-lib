"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elliptic_1 = require("./elliptic");
const util_1 = require("./util");
const buffutils = require("../buffutils");
const sha256_1 = require("../bcrypto/sha256");
function blindMessage(secret, nonce, signer, message) {
    const R = nonce;
    const P = signer;
    const alpha = buffutils.toBigInt(sha256_1.default.mac(buffutils.fromString('alpha'), buffutils.concat(secret, util_1.pointToBuffer(nonce), util_1.pointToBuffer(signer), message)));
    // spin beta until we find quadratic residue
    let retry = 0;
    let beta;
    let RPrime;
    while (true) {
        beta = buffutils.toBigInt(sha256_1.default.mac(buffutils.fromString('beta'), buffutils.concat(secret, util_1.pointToBuffer(nonce), util_1.pointToBuffer(signer), message, Uint8Array.of(retry))));
        RPrime = elliptic_1.pointAdd(R, elliptic_1.pointMultiply(util_1.secp256k1.g, alpha), elliptic_1.pointMultiply(P, beta));
        if (util_1.jacobi(RPrime.y) === BigInt(1)) {
            break;
        }
        else {
            retry++;
        }
    }
    // the challenge
    const cPrime = buffutils.toBigInt(sha256_1.default.digest(util_1.bufferFromBigInt(RPrime.x), util_1.pointToBuffer(P), message)) % util_1.secp256k1.n;
    // the blinded challenge
    const c = elliptic_1.scalarAdd(cPrime, beta);
    return [{ alpha, r: RPrime.x }, { c }];
}
exports.blindMessage = blindMessage;
function blindSign(signer, nonce, { c }) {
    const s = elliptic_1.scalarAdd(nonce, elliptic_1.scalarMultiply(c, signer));
    return { s };
}
exports.blindSign = blindSign;
function unblind({ alpha, r }, blindedSig) {
    const s = elliptic_1.scalarAdd(blindedSig.s, alpha);
    return { r, s };
}
exports.unblind = unblind;
//# sourceMappingURL=blind.js.map