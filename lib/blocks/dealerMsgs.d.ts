import { LyraApi } from "../lyra-api";
import { APIResult } from "./meta";
export declare class DealMessage {
    PrevHash: string;
    TimeStamp: string;
    TradeId: string;
    AccountId: string;
    constructor(messageData: string | undefined);
    toSigned(wallet: LyraApi): {};
}
export declare class SignedMessage extends DealMessage {
    Hash: string;
    Signature: string;
    constructor(messageData: string | undefined);
}
export declare class DealChatMessage extends DealMessage {
    Text: string;
    constructor(messageData: string | undefined);
}
export declare enum PinnedMode {
    Notify = 0,
    Wait = 1,
    Action = 2
}
export declare enum DisputeLevels {
    None = 0,
    Peer = 1,
    DAO = 2,
    LyraCouncil = 3
}
export declare class PinnedMessage {
    mode: PinnedMode;
    tradeId: string;
    text: string;
    level: DisputeLevels;
}
export declare class ChatMessages {
    DealerId: string;
    Pinned: PinnedMessage;
    History: DealMessage[];
    Roles: StringDictionary;
}
export interface ChatDictionary {
    [key: string]: ChatMessages;
}
interface StringDictionary {
    [key: string]: string;
}
export declare class JoinRoomResult extends APIResult {
    history: ChatMessages;
    roles: StringDictionary;
}
export {};
