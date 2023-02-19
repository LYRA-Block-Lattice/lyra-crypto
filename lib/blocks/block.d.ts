import { LyraApi } from "../lyra-api";
import { AccountTypes, AuthorizationFeeTypes, BlockTypes, ContractTypes, NonFungibleTokenTypes } from "./meta";
export declare class LyraGlobal {
    static readonly DatabaseVersion = 11;
    static readonly BALANCERATIO = 100000000;
    static readonly REQSERVICETAG = "svcreq";
    static readonly MANAGEDTAG = "managed";
    static readonly OFFICIALTICKERCODE = "LYR";
    static readonly GUILDACCOUNTID = "L8cqJqYPyx9NjiRYf8KyCjBaCmqdgvZJtEkZ7M9Hf7LnzQU3DamcurxeDEkws9HXPjLaGi9CVgcRwdCp377xLEB1qcX15";
}
export declare class Block {
    Height: number;
    TimeStamp: string;
    Version: number;
    BlockType: BlockTypes;
    PreviousHash: string | null;
    ServiceHash: string;
    Tags: any;
    constructor(blockData: string | undefined);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
export declare class SignedBlock extends Block {
    Hash: string;
    Signature: string;
    constructor(blockData: string | undefined);
}
export declare class CurrentServiceBlock extends SignedBlock {
    Leader: string;
    Authorizers: {
        [key: string]: string;
    };
    NetworkId: string;
    FeeTicker: string;
    TransferFee: number;
    TokenGenerationFee: number;
    TradeFee: number;
    FeesGenerated: number;
    constructor(blockData: string | undefined);
}
export declare class TransactionBlock extends Block {
    AccountID: string;
    Balances: {
        [key: string]: number;
    };
    Fee: number;
    FeeCode: string;
    FeeType: AuthorizationFeeTypes;
    NonFungibleToken: any;
    VoteFor: any;
    constructor(blockData: string | undefined);
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
export declare class SendTransferBlock extends TransactionBlock {
    DestinationAccountId: string;
    constructor(blockData: string | undefined);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
export declare class ReceiveTransferBlock extends TransactionBlock {
    SourceHash: string | null;
    constructor(blockData: string | undefined);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
export declare class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
    AccountType: AccountTypes;
    constructor(blockData: string | undefined);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
export declare class TokenGenesisBlock extends ReceiveTransferBlock {
    Ticker: string;
    DomainName: string;
    ContractType: ContractTypes;
    RenewalDate: Date;
    Edition: number;
    Description: string;
    Precision: number;
    IsFinalSupply: boolean;
    IsNonFungible: boolean;
    NonFungibleType: NonFungibleTokenTypes;
    NonFungibleKey: string;
    Owner: string | null;
    Address: string | null;
    Currency: string | null;
    Icon: string | null;
    Image: string | null;
    Custom1: string | null;
    Custom2: string | null;
    Custom3: string | null;
    constructor(blockData: string | undefined);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi, sb: CurrentServiceBlock): string;
}
