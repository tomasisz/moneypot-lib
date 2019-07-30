import * as POD from './pod';
import Hash from './hash';
export default class FeeBump {
    static fromPOD(data: any): FeeBump | Error;
    txid: Uint8Array;
    nonce: Uint8Array;
    amount: POD.Amount;
    constructor(txid: Uint8Array, nonce: Uint8Array, amount: POD.Amount);
    toPOD(): POD.FeeBump;
    hash(): Hash;
}
