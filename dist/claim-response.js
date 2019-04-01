"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blinded_signature_1 = require("./blinded-signature");
const claim_request_1 = require("./claim-request");
const hash_1 = require("./hash");
// The response embeds the request, to make it easier to store/verify
class ClaimResponse {
    static fromPOD(data) {
        if (typeof data !== 'object') {
            throw new Error('ClaimResponse must be an object');
        }
        const claimRequest = claim_request_1.default.fromPOD(data.claimRequest);
        if (claimRequest instanceof Error) {
            return claimRequest;
        }
        if (!Array.isArray(data.blindedReceipts)) {
            return new Error('expected blindedReceipts in ClaimResponse to be an array');
        }
        const blindedReceipts = [];
        for (const bep of data.blindedReceipts) {
            const blindedReceipt = blinded_signature_1.default.fromBech(bep);
            if (blindedReceipt instanceof Error) {
                return blindedReceipt;
            }
            blindedReceipts.push(blindedReceipt);
        }
        return new ClaimResponse(claimRequest, blindedReceipts);
    }
    constructor(claimRequest, blindedReceipts) {
        this.claimRequest = claimRequest;
        this.blindedReceipts = blindedReceipts;
    }
    hash() {
        const h = hash_1.default.newBuilder('ClaimResponse');
        h.update(this.claimRequest.hash().buffer);
        for (const blindedReceipt of this.blindedReceipts) {
            h.update(blindedReceipt.buffer);
        }
        return h.digest();
    }
    toPOD() {
        return {
            blindedReceipts: this.blindedReceipts.map(x => x.toBech()),
            claimRequest: this.claimRequest.toPOD(),
        };
    }
}
exports.default = ClaimResponse;
//# sourceMappingURL=claim-response.js.map