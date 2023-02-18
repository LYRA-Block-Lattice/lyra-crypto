"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWithReceiveTransferBlock = exports.ReceiveTransferBlock = exports.SendTransferBlock = exports.TransactionBlock = exports.Block = exports.LyraGlobal = void 0;
const lyra_crypto_1 = require("../lyra-crypto");
const meta_1 = require("./meta");
const stringify = require("json-stable-stringify");
class LyraGlobal {
}
exports.LyraGlobal = LyraGlobal;
LyraGlobal.DatabaseVersion = 11;
class Block {
    constructor(blockData) {
        const decodedBlockData = JSON.parse(blockData);
        this.Height = decodedBlockData.Height + 1;
        this.TimeStamp = new Date().toISOString();
        this.Version = LyraGlobal.DatabaseVersion;
        this.BlockType = this.GetBlockType();
        this.PreviousHash = decodedBlockData.Hash;
        this.Tags = null;
    }
    GetBlockType() {
        return meta_1.BlockTypes.Null;
    }
    toJson(wallet) {
        var json = stringify(this);
        // hack: to compatible with Newtonsoft.Json
        json = json.replace(',"Fee":1,', ',"Fee":1.0,');
        //console.log("original block:", sendBlock);
        console.log("json to hash:", json);
        var hash = lyra_crypto_1.LyraCrypto.Hash(json);
        const signature = wallet.sign(hash);
        console.log(`Hash is: ${hash} and signature is ${signature}`);
        var finalBlock = {
            ...this,
            Signature: signature,
            Hash: hash
        };
        var finalJson = JSON.stringify(finalBlock);
        return finalJson;
    }
}
exports.Block = Block;
class TransactionBlock extends Block {
    constructor(blockData) {
        super(blockData);
        const decodedBlockData = JSON.parse(blockData);
        this.AccountID = decodedBlockData.AccountID;
        this.Balances = decodedBlockData.Balances;
        this.Fee = decodedBlockData.Fee;
        this.FeeCode = decodedBlockData.FeeCode;
        this.FeeType = decodedBlockData.FeeType;
        this.NonFungibleToken = decodedBlockData.NonFungibleToken;
        this.VoteFor = decodedBlockData.VoteFor;
    }
}
exports.TransactionBlock = TransactionBlock;
class SendTransferBlock extends TransactionBlock {
    constructor(blockData) {
        super(blockData);
        const decodedBlockData = JSON.parse(blockData);
        this.DestinationAccountId = decodedBlockData.DestinationAccountId;
    }
    GetBlockType() {
        return meta_1.BlockTypes.SendTransfer;
    }
}
exports.SendTransferBlock = SendTransferBlock;
class ReceiveTransferBlock extends TransactionBlock {
    constructor(blockData) {
        super(blockData);
        const decodedBlockData = JSON.parse(blockData);
        this.SourceHash = decodedBlockData.SourceHash;
    }
    GetBlockType() {
        return meta_1.BlockTypes.ReceiveTransfer;
    }
}
exports.ReceiveTransferBlock = ReceiveTransferBlock;
class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
    constructor(blockData) {
        super(blockData);
    }
    GetBlockType() {
        return meta_1.BlockTypes.OpenAccountWithReceiveTransfer;
    }
}
exports.OpenWithReceiveTransferBlock = OpenWithReceiveTransferBlock;
