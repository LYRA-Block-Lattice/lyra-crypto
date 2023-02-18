import { ContractTypes } from "./blocks/meta";
export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    accountId: string;
    constructor(network: string, privateKey: string, node?: string);
    init(): void;
    sign(data: string): string;
    send(amount: number, destAddr: string, token: string): Promise<any>;
    receive(): Promise<any>;
    balance(): Promise<{
        data: any;
        balance: any;
    } | undefined>;
    history(start: Date, end: Date, count: number): Promise<any>;
    close(): void;
    mintToken(tokenName: string, domainName: string, description: string, precision: number, supply: number, isFinalSupply: boolean, owner: string, // shop name
    address: string, // shop URL
    currency: string, // USD
    contractType: ContractTypes, // reward or discount or custom
    tags: Record<string, string>): Promise<any>;
}
