export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    private accountId;
    private ws;
    constructor(network: string, privateKey: string, node?: string);
    init(): Promise<void>;
    private createWS;
    send(destAddr: string, amount: number, token: string): Promise<any>;
    receive(): Promise<any>;
    balance(): Promise<any>;
    close(): void;
}
