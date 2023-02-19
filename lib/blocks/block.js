"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniTrade = exports.UniOrder = exports.TokenGenesisBlock = exports.OpenWithReceiveTransferBlock = exports.ReceiveTransferBlock = exports.SendTransferBlock = exports.TransactionBlock = exports.CurrentServiceBlock = exports.SignedBlock = exports.Block = exports.LyraGlobal = void 0;
const lyra_crypto_1 = require("../lyra-crypto");
const meta_1 = require("./meta");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
class LyraGlobal {
}
exports.LyraGlobal = LyraGlobal;
LyraGlobal.DatabaseVersion = 11;
LyraGlobal.BALANCERATIO = 100000000;
LyraGlobal.REQSERVICETAG = "svcreq";
LyraGlobal.MANAGEDTAG = "managed";
LyraGlobal.OFFICIALTICKERCODE = "LYR";
LyraGlobal.GUILDACCOUNTID = "L8cqJqYPyx9NjiRYf8KyCjBaCmqdgvZJtEkZ7M9Hf7LnzQU3DamcurxeDEkws9HXPjLaGi9CVgcRwdCp377xLEB1qcX15";
LyraGlobal.GetListingFeeFor = () => 10;
class Block {
    constructor(blockData) {
        this.TimeStamp = new Date().toISOString();
        this.Version = LyraGlobal.DatabaseVersion;
        this.BlockType = this.GetBlockType();
        this.PreviousHash = null;
        this.Tags = null;
        if (blockData === undefined) {
            this.Height = 1;
        }
        else {
            const decodedBlockData = JSON.parse(blockData);
            this.Height = decodedBlockData.Height + 1;
            this.PreviousHash = decodedBlockData.Hash;
        }
    }
    GetBlockType() {
        return meta_1.BlockTypes.Null;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.ServiceHash = sb.Hash;
        var json = (0, json_stable_stringify_1.default)(this);
        // hack: to compatible with Newtonsoft.Json
        //json = json.replace(',"Fee":1,', ',"Fee":1.0,');
        //console.log("original block:", sendBlock);
        console.log("json to hash:", json);
        var hash = lyra_crypto_1.LyraCrypto.Hash(json);
        const signature = wallet.sign(hash);
        //console.log(`Hash is: ${hash} and signature is ${signature}`);
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
class SignedBlock extends Block {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
            throw new Error("blockData is undefined. should not happen.");
        }
        else {
            const decodedBlockData = JSON.parse(blockData);
            this.Hash = decodedBlockData.Hash;
            this.Signature = decodedBlockData.Signature;
        }
    }
}
exports.SignedBlock = SignedBlock;
class CurrentServiceBlock extends SignedBlock {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
            throw new Error("blockData is undefined. should not happen.");
        }
        else {
            const decodedBlockData = JSON.parse(blockData);
            this.Leader = decodedBlockData.Leader;
            this.Authorizers = decodedBlockData.Authorizers;
            this.NetworkId = decodedBlockData.NetworkId;
            this.FeeTicker = decodedBlockData.FeeTicker;
            this.TransferFee = decodedBlockData.TransferFee;
            this.TokenGenerationFee = decodedBlockData.TokenGenerationFee;
            this.TradeFee = decodedBlockData.TradeFee;
            this.FeesGenerated = decodedBlockData.FeesGenerated;
        }
    }
}
exports.CurrentServiceBlock = CurrentServiceBlock;
class TransactionBlock extends Block {
    constructor(blockData) {
        super(blockData);
        this.NonFungibleToken = null;
        if (blockData === undefined) {
            this.Balances = {};
            this.VoteFor = null;
        }
        else {
            const decodedBlockData = JSON.parse(blockData);
            this.AccountID = decodedBlockData.AccountID;
            this.Balances = decodedBlockData.Balances;
            this.VoteFor = decodedBlockData.VoteFor;
        }
    }
    toJson(wallet, sb) {
        this.AccountID = wallet.accountId;
        // setup service block related fields
        this.FeeCode = sb.FeeTicker;
        return super.toJson(wallet, sb);
    }
}
exports.TransactionBlock = TransactionBlock;
class SendTransferBlock extends TransactionBlock {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
        }
        else {
            const decodedBlockData = JSON.parse(blockData);
            this.DestinationAccountId = decodedBlockData.DestinationAccountId;
        }
    }
    GetBlockType() {
        return meta_1.BlockTypes.SendTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.Fee = sb.TransferFee;
        this.FeeType = meta_1.AuthorizationFeeTypes.Regular;
        this.Balances[sb.FeeTicker] -= sb.TransferFee * LyraGlobal.BALANCERATIO;
        return super.toJson(wallet, sb);
    }
}
exports.SendTransferBlock = SendTransferBlock;
class ReceiveTransferBlock extends TransactionBlock {
    constructor(blockData) {
        super(blockData);
    }
    GetBlockType() {
        return meta_1.BlockTypes.ReceiveTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        if (this.BlockType == meta_1.BlockTypes.ReceiveTransfer) {
            this.Fee = 0;
            this.FeeType = meta_1.AuthorizationFeeTypes.NoFee;
        }
        return super.toJson(wallet, sb);
    }
}
exports.ReceiveTransferBlock = ReceiveTransferBlock;
class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
            this.AccountType = meta_1.AccountTypes.Standard;
        }
        else {
            throw new Error("Should not be called with blockData");
        }
    }
    GetBlockType() {
        return meta_1.BlockTypes.OpenAccountWithReceiveTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.Fee = 0;
        this.FeeType = meta_1.AuthorizationFeeTypes.NoFee;
        return super.toJson(wallet, sb);
    }
}
exports.OpenWithReceiveTransferBlock = OpenWithReceiveTransferBlock;
class TokenGenesisBlock extends ReceiveTransferBlock {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
            throw new Error("Should not be called with blockData");
        }
        else {
            this.IsNonFungible = false;
        }
    }
    GetBlockType() {
        return meta_1.BlockTypes.TokenGenesis;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        //console.log("sb: ", sb);
        this.Fee = sb.TokenGenerationFee;
        this.FeeType = meta_1.AuthorizationFeeTypes.Regular;
        this.Balances[sb.FeeTicker] -=
            sb.TokenGenerationFee * LyraGlobal.BALANCERATIO;
        return super.toJson(wallet, sb);
    }
}
exports.TokenGenesisBlock = TokenGenesisBlock;
class UniOrder {
}
exports.UniOrder = UniOrder;
class UniTrade {
    constructor(daoId, dealerId, orderId, orderOwnerId, offby, offering, bidby, biding, price, eqprice, amount, cltamt, pay, payVia) {
        this.daoId = daoId;
        this.dealerId = dealerId;
        this.orderId = orderId;
        this.orderOwnerId = orderOwnerId;
        this.offby = offby;
        this.offering = offering;
        this.bidby = bidby;
        this.biding = biding;
        this.price = price;
        this.eqprice = eqprice;
        this.amount = amount;
        this.cltamt = cltamt;
        this.pay = pay;
        this.payVia = payVia;
    }
}
exports.UniTrade = UniTrade;
