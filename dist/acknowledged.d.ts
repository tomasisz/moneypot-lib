import Signature from './signature';
import Hash from './hash';
import PrivateKey from './private-key';
import PublicKey from './public-key';
import _Hookout from './hookout';
import _FeeBump from './fee-bump';
import _LightningPayment from './lightning-payment';
import _LightningInvoice from './lightning-invoice';
import _Hookin from './hookin';
import { Claimable as _Claimable } from './claimable';
import _Status from './status';
interface Acknowledgable {
    hash(): Hash;
    toPOD(): object;
}
export default class Acknowledged<T extends Acknowledgable> {
    acknowledgement: Signature;
    contents: T;
    static acknowledge<T extends Acknowledgable>(contents: T, acknowledgeKey: PrivateKey): Acknowledged<T>;
    static fromPOD<T extends Acknowledgable>(creator: (data: any) => T | Error, data: any): Acknowledged<T> | Error;
    verify(acknowledgementPublicKey: PublicKey): boolean;
    hash(): Hash;
    constructor(contents: T, acknowledgement: Signature);
    toPOD(): {
        acknowledgement: string;
    };
}
export declare type Hookin = Acknowledged<_Hookin>;
export declare function hookinFromPod(x: any): Hookin | Error;
export declare type FeeBump = Acknowledged<_FeeBump>;
export declare function feeBumpFromPod(x: any): FeeBump | Error;
export declare type LightningPayment = Acknowledged<_LightningPayment>;
export declare function lightningPaymentFromPod(x: any): LightningPayment | Error;
export declare type LightningInvoice = Acknowledged<_LightningInvoice>;
export declare function lightningInvoiceFromPod(x: any): LightningInvoice | Error;
export declare type Hookout = Acknowledged<_Hookout>;
export declare function hookoutFromPod(x: any): Hookout | Error;
export declare type Claimable = Acknowledged<_Claimable>;
export declare function claimableFromPOD(x: any): Claimable | Error;
export declare type Status = Acknowledged<_Status>;
export declare function statusFromPOD(x: any): Status | Error;
export declare function acknowledge(x: _Status, acknowledgeKey: PrivateKey): Status;
export declare function acknowledge(x: _Claimable, acknowledgeKey: PrivateKey): Claimable;
export {};
