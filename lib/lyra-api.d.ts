export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    private accountId;
    private ws;
    constructor(network: string, privateKey: string, node?: string);
    init(): Promise<void>;
    private createWS;
    send(destAddr: string, amount: number, token: string): Promise<void>;
    receive(): Promise<import("jsonrpc-client-websocket").JsonRpcResponse>;
    balance(): Promise<import("jsonrpc-client-websocket").JsonRpcResponse>;
    close(): void;
}
