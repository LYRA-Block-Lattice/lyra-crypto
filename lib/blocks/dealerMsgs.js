"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomResult = exports.ChatMessages = exports.PinnedMessage = exports.DisputeLevels = exports.PinnedMode = exports.DealChatMessage = exports.SignedMessage = exports.DealMessage = void 0;
const lyra_crypto_1 = require("../lyra-crypto");
const meta_1 = require("./meta");
const stringify = require("../../my-json-stringify");
var JSONbig = require("json-bigint");
class DealMessage {
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
        var hash = lyra_crypto_1.LyraCrypto.Hash(json);
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
exports.DealMessage = DealMessage;
class SignedMessage extends DealMessage {
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
exports.SignedMessage = SignedMessage;
class DealChatMessage extends DealMessage {
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
exports.DealChatMessage = DealChatMessage;
var PinnedMode;
(function (PinnedMode) {
    PinnedMode[PinnedMode["Notify"] = 0] = "Notify";
    PinnedMode[PinnedMode["Wait"] = 1] = "Wait";
    PinnedMode[PinnedMode["Action"] = 2] = "Action";
})(PinnedMode = exports.PinnedMode || (exports.PinnedMode = {}));
var DisputeLevels;
(function (DisputeLevels) {
    DisputeLevels[DisputeLevels["None"] = 0] = "None";
    DisputeLevels[DisputeLevels["Peer"] = 1] = "Peer";
    DisputeLevels[DisputeLevels["DAO"] = 2] = "DAO";
    DisputeLevels[DisputeLevels["LyraCouncil"] = 3] = "LyraCouncil";
})(DisputeLevels = exports.DisputeLevels || (exports.DisputeLevels = {}));
class PinnedMessage {
}
exports.PinnedMessage = PinnedMessage;
class ChatMessages {
}
exports.ChatMessages = ChatMessages;
class JoinRoomResult extends meta_1.APIResult {
}
exports.JoinRoomResult = JoinRoomResult;
