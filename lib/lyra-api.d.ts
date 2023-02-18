export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    private accountId;
    constructor(network: string, privateKey: string, node?: string);
    init(): void;
    sign(data: string): string;
    send(amount: number, destAddr: string, token: string): Promise<any>;
    receive(): Promise<void>;
    balance(): Promise<{
        data: any;
        balance: any;
    } | undefined>;
    history(startTimeUtc: Date, endTimeUtc: Date, count: number): Promise<void>;
    close(): void;
}
