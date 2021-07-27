export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    private accountId;
    private ws;
    constructor(network: string, privateKey: string, node?: string);
    init(): Promise<void>;
    private createWS;
    send(amount: number, destAddr: string, token: string): Promise<any>;
    receive(): Promise<any>;
    balance(): Promise<any>;
    history(startTimeUtc: Date, endTimeUtc: Date, count: number): Promise<any>;
    close(): void;
}
