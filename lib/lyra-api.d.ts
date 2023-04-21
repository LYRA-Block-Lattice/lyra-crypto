import { ReceiveTransferBlock, UniOrder, UniTrade } from "./blocks/block";
import { Amounts, APIResult, AuthorizationAPIResult, ContractTypes, HoldTypes, LyraContractABI } from "./blocks/meta";
export declare class LyraApi {
    private network;
    private nodeAddress?;
    private prvKey;
    accountId: string;
    constructor(network: string, privateKey: string, node?: string);
    init(): void;
    sign(data: string): string;
    sendEx(destinationAccountId: string, amounts: Amounts, tags: {
        [key: string]: string;
    } | undefined): Promise<AuthorizationAPIResult>;
    send(amount: number, destAddr: string, token: string): Promise<AuthorizationAPIResult>;
    receive(onNewBlock: (block: ReceiveTransferBlock) => void): Promise<AuthorizationAPIResult | import("./blocks/meta").NewTransferAPIResult2>;
    balance(): Promise<{
        data: any;
        balance: any;
    } | undefined>;
    history(start: Date, end: Date, count: number): Promise<any>;
    close(): void;
    mintToken(tokenName: string, domainName: string, description: string, precision: number, supply: number, isFinalSupply: boolean, owner: string | undefined, // shop name
    address: string | undefined, // shop URL
    currency: string | undefined, // USD
    contractType: ContractTypes, // reward or discount or custom
    tags: Record<string, string> | undefined): Promise<AuthorizationAPIResult>;
    mintNFT(name: string, description: string, supply: number, metadataUri: string, owner: string | undefined): Promise<AuthorizationAPIResult>;
    createTOT(type: HoldTypes, name: string, description: string, supply: number, metadataUri: string, descSignature: string, owner: string | undefined): Promise<AuthorizationAPIResult>;
    serviceRequestAsync(type: string, arg: LyraContractABI): Promise<AuthorizationAPIResult>;
    createFiatWalletAsync(symbol: string): Promise<APIResult>;
    printFiat(symbol: string, count: number): Promise<APIResult>;
    createOrder(order: UniOrder): Promise<AuthorizationAPIResult>;
    createTrade(trade: UniTrade): Promise<AuthorizationAPIResult>;
    DelistUniOrder(daoId: string, orderId: string): Promise<AuthorizationAPIResult>;
    CloseUniOrder(daoId: string, orderId: string): Promise<AuthorizationAPIResult>;
}
