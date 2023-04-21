import { APIResult, AuthorizationAPIResult, BlockAPIResult, ImageUploadResult, MultiBlockAPIResult, NewTransferAPIResult2, NftMetadata, SimpleJsonAPIResult } from "./blocks/meta";
import { IDao, IUniOrder, TokenGenesisBlock } from "./blocks/block";
import { AxiosRequestConfig } from "axios";
export type FindToken = {
    token: string;
    domain: string;
    isTOT: boolean;
    name: string;
};
export type FindTokenList = FindToken[];
export interface IOrdersResult {
    OverStats: {
        _id: number;
        Count: number;
    }[];
    OwnerStats: {
        _id: {
            Owner: string;
            State: number;
            Name: string;
            Avatar: string;
        };
        Count: number;
    }[];
    Daos: IDao[];
    Orders: any[];
}
export interface IOwnerOrder {
    daoid: string;
    orderid: string;
    status: string;
    offering: string;
    biding: string;
    amount: number;
    price: number;
    limitmin: number;
    limitmax: number;
    time: string;
    sold: number;
    shelf: number;
}
export interface IOwnerTrade {
    dir: string;
    tradeId: string;
    status: string;
    offering: string;
    biding: string;
    amount: number;
    price: number;
    time: string;
}
export interface IDealerOrder {
    OrderId: string;
    Blocks: {
        Order: IUniOrder;
        Offgen: TokenGenesisBlock;
        Bidgen: TokenGenesisBlock;
        Dao: IDao;
    };
    Users: {
        Seller: {
            UserName: string;
            AccountId: string;
            AvatarId: string;
        };
        Author: {
            UserName: string;
            AccountId: string;
            AvatarId: string;
        };
    };
    Meta: NftMetadata;
}
export interface IDealerInfo {
    Version: string;
    Name: string;
    AccountId: string;
    ServiceId: string;
    TelegramBotUsername: string;
}
type Constructor<T> = new () => T;
export declare class BlockchainAPI {
    static networkid: string;
    static Block_API_v1: string;
    static Block_API_v2: string;
    static Dealer_API: string;
    static Start_API: string;
    static setNetworkId: (id: string | undefined) => void;
    static getBlockExplorerUrl: (id: string) => string;
    static fetchJson2: <T>(resultType: Constructor<T>, url: string, options?: AxiosRequestConfig) => Promise<T>;
    static fetchJson<T>(url: string, options?: AxiosRequestConfig): Promise<T>;
    static postJson<T>(url: string, json: any, options?: AxiosRequestConfig): Promise<T>;
    static getLastServiceBlock: () => Promise<BlockAPIResult>;
    static sendTransfer: (sendBlock: string) => Promise<AuthorizationAPIResult>;
    static recvTransfer: (receiveBlock: string) => Promise<AuthorizationAPIResult>;
    static recvTransferWithOpenAccount: (openReceiveBlock: string) => Promise<AuthorizationAPIResult>;
    static mintToken: (tokenBlock: string) => Promise<AuthorizationAPIResult>;
    static getUnreceived: (accountId: string) => Promise<NewTransferAPIResult2>;
    static findTokens: (keyword: string, cat: string) => Promise<FindTokenList>;
    static getBlockBySourceHash: (hash: string) => Promise<BlockAPIResult>;
    static findFiatWallet: (owner: string, symbol: string) => Promise<BlockAPIResult>;
    static getHistory: (accountId: string, start: Date, end: Date, count: number) => Promise<any>;
    static searchDao: (q: string) => Promise<MultiBlockAPIResult>;
    static GetLastBlock: (accountId: string) => Promise<BlockAPIResult>;
    static getTradeForOrder: (orderId: string) => Promise<any>;
    static lastServiceHash: () => Promise<any>;
    static getBalance: (accountId: string) => Promise<any>;
    static startWallet: (accountId: string, signature: string) => Promise<APIResult>;
    static getPrices: () => Promise<SimpleJsonAPIResult>;
    static fetchOrders: (catalog: string | undefined) => Promise<IOrdersResult>;
    static fetchOrderById: (orderId: string) => Promise<IDealerOrder>;
    static fetchOrdersByOwner: (owner: string) => Promise<IOwnerOrder[]>;
    static fetchTradesByOwner: (owner: string) => Promise<IOwnerTrade[]>;
    static fetchDealer: () => Promise<IDealerInfo>;
    static uploadFile: (theForm: FormData) => Promise<ImageUploadResult>;
    static createNFTMeta: (accountId: string, signature: string, name: string, description: string, imgUrl: string) => Promise<ImageUploadResult>;
}
export {};
