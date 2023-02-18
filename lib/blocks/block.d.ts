import { LyraApi } from "../lyra-api";
import { AccountTypes, BlockTypes } from "./meta";
export declare class LyraGlobal {
    static readonly DatabaseVersion = 11;
}
export declare class Block {
    Height: number;
    TimeStamp: string;
    Version: number;
    BlockType: BlockTypes;
    PreviousHash: string;
    ServiceHash: string;
    Tags: any;
    constructor(blockData: string);
    GetBlockType(): BlockTypes;
    toJson(wallet: LyraApi): string;
}
export declare class TransactionBlock extends Block {
    AccountID: string;
    Balances: {
        [key: string]: number;
    };
    Fee: number;
    FeeCode: string;
    FeeType: number;
    NonFungibleToken: any;
    VoteFor: any;
    constructor(blockData: string);
}
export declare class SendTransferBlock extends TransactionBlock {
    DestinationAccountId: string;
    constructor(blockData: string);
    GetBlockType(): BlockTypes;
}
export declare class ReceiveTransferBlock extends TransactionBlock {
    SourceHash: string;
    constructor(blockData: string);
    GetBlockType(): BlockTypes;
}
export declare class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
    AccountType: AccountTypes;
    constructor(blockData: string);
    GetBlockType(): BlockTypes;
}
