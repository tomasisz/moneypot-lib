import * as POD from './pod';
import SpentCoinSet from './spent-coin-set';
import Hookout from './hookout';
export default class TransferCoinToHookout {
    static fromPOD(data: any): TransferCoinToHookout | Error;
    input: SpentCoinSet;
    output: Hookout;
    constructor(input: SpentCoinSet, output: Hookout);
    hash(): import("./hash").default;
    toPOD(): POD.TransferCoinToHookout;
}
