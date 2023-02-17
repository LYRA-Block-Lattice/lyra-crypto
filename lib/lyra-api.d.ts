export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    private accountId;
    constructor(network: string, privateKey: string, node?: string);
    send(amount: number, destAddr: string, token: string): Promise<void>;
    receive(): Promise<void>;
    balance(): Promise<void>;
    history(startTimeUtc: Date, endTimeUtc: Date, count: number): Promise<void>;
    close(): void;
}
