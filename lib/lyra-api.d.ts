import { UniOrder, UniTrade } from "./blocks/block";
import { APIResult, AuthorizationAPIResult, ContractTypes, HoldTypes, LyraContractABI } from "./blocks/meta";
export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    accountId: string;
    constructor(network: string, privateKey: string, node?: string);
    init(): void;
    sign(data: string): string;
    sendEx(destinationAccountId: string, amounts: {
        [key: string]: number;
    }, tags: {
        [key: string]: string;
    } | null): Promise<AuthorizationAPIResult>;
    send(amount: number, destAddr: string, token: string): Promise<AuthorizationAPIResult>;
    receive(): Promise<any>;
    balance(): Promise<{
        data: any;
        balance: any;
    } | undefined>;
    history(start: Date, end: Date, count: number): Promise<any>;
    close(): void;
    mintToken(tokenName: string, domainName: string, description: string, precision: number, supply: number, isFinalSupply: boolean, owner: string | null, // shop name
    address: string | null, // shop URL
    currency: string | null, // USD
    contractType: ContractTypes, // reward or discount or custom
    tags: Record<string, string> | null): Promise<any>;
    mintNFT(name: string, description: string, supply: number, metadataUri: string, owner: string | null): Promise<any>;
    createTOT(type: HoldTypes, name: string, description: string, supply: number, metadataUri: string, descSignature: string, owner: string | null): Promise<AuthorizationAPIResult>;
    serviceRequestAsync(arg: LyraContractABI): Promise<AuthorizationAPIResult>;
    createFiatWalletAsync(symbol: string): Promise<APIResult>;
    printFiat(symbol: string, count: number): Promise<APIResult>;
    createUniOrder(order: UniOrder): Promise<AuthorizationAPIResult>;
    createUniTrade(trade: UniTrade): Promise<AuthorizationAPIResult>;
    DelistUniOrder(daoId: string, orderId: string): Promise<AuthorizationAPIResult>;
    CloseUniOrder(daoId: string, orderId: string): Promise<AuthorizationAPIResult>;
}
