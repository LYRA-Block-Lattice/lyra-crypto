import { LyraCrypto } from "../lyra-crypto";
import { APIResult } from "./meta";
const stringify = require("../../my-json-stringify");
var JSONbig = require("json-bigint");
export class DealMessage {
    constructor(messageData) {
        if (messageData === undefined) {
            this.TimeStamp = new Date().toISOString();
            this.PrevHash = "";
            this.TradeId = "";
            this.AccountId = "";
        }
        else {
            const decodedBlockData = JSON.parse(messageData);
            this.TimeStamp = decodedBlockData.TimeStamp;
            this.PrevHash = decodedBlockData.PrevHash;
            this.TradeId = decodedBlockData.TradeId;
            this.AccountId = decodedBlockData.AccountId;
        }
    }
    toSigned(wallet) {
        var json = stringify(this);
        console.log("json to hash:", json);
        var hash = LyraCrypto.Hash(json);
        const signature = wallet.sign(hash);
        //console.log(`Hash is: ${hash} and signature is ${signature}`);
        var finalBlock = {
            ...this,
            Signature: signature,
            Hash: hash
        };
        return finalBlock;
    }
}
export class SignedMessage extends DealMessage {
    constructor(messageData) {
        super(messageData);
        if (messageData === undefined) {
            throw new Error("messageData is undefined. should not happen.");
        }
        else {
            const decodedBlockData = JSON.parse(messageData);
            this.Hash = decodedBlockData.Hash;
            this.Signature = decodedBlockData.Signature;
        }
    }
}
export class DealChatMessage extends DealMessage {
    constructor(messageData) {
        super(messageData);
        if (messageData === undefined) {
            this.Text = "";
        }
        else {
            const decodedBlockData = JSON.parse(messageData);
            this.Text = decodedBlockData.Text;
        }
    }
}
export var PinnedMode;
(function (PinnedMode) {
    PinnedMode[PinnedMode["Notify"] = 0] = "Notify";
    PinnedMode[PinnedMode["Wait"] = 1] = "Wait";
    PinnedMode[PinnedMode["Action"] = 2] = "Action";
})(PinnedMode || (PinnedMode = {}));
export var DisputeLevels;
(function (DisputeLevels) {
    DisputeLevels[DisputeLevels["None"] = 0] = "None";
    DisputeLevels[DisputeLevels["Peer"] = 1] = "Peer";
    DisputeLevels[DisputeLevels["DAO"] = 2] = "DAO";
    DisputeLevels[DisputeLevels["LyraCouncil"] = 3] = "LyraCouncil";
})(DisputeLevels || (DisputeLevels = {}));
export class PinnedMessage {
}
export class ChatMessages {
}
export class JoinRoomResult extends APIResult {
}
