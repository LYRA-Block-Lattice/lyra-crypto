import { LyraCrypto } from "../lyra-crypto";
import { AccountTypes, AuthorizationFeeTypes, BlockTypes } from "./meta";
const stringify = require("../my-json-stringify");
var JSONbig = require("json-bigint");
const maxInt64 = BigInt("9223372036854775807");
export const toBalanceBigInt = (balance) => balance * BigInt(100000000);
export const numberToBalanceBigInt = (value) => BigInt(Math.round(value * 100000000));
export class LyraGlobal {
}
LyraGlobal.DatabaseVersion = 11;
LyraGlobal.BALANCERATIO = 100000000;
LyraGlobal.REQSERVICETAG = "svcreq";
LyraGlobal.MANAGEDTAG = "managed";
LyraGlobal.OFFICIALTICKERCODE = "LYR";
LyraGlobal.GUILDACCOUNTID = "L8cqJqYPyx9NjiRYf8KyCjBaCmqdgvZJtEkZ7M9Hf7LnzQU3DamcurxeDEkws9HXPjLaGi9CVgcRwdCp377xLEB1qcX15";
LyraGlobal.OfferingNetworkFeeRatio = 0.002;
LyraGlobal.BidingNetworkFeeRatio = 0;
LyraGlobal.GetListingFeeFor = () => 100;
export class Block {
    constructor(blockData) {
        this.TimeStamp = new Date().toISOString();
        this.Version = LyraGlobal.DatabaseVersion;
        this.BlockType = this.GetBlockType();
        this.PreviousHash = undefined;
        this.Tags = undefined;
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
        return BlockTypes.Null;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.ServiceHash = sb.Hash;
        var json = stringify(this);
        // hack: to compatible with Newtonsoft.Json
        //json = json.replace(',"Fee":1,', ',"Fee":1.0,');
        //console.log("original block:", sendBlock);
        console.log("json to hash:", json);
        var hash = LyraCrypto.Hash(json);
        const signature = wallet.sign(hash);
        //console.log(`Hash is: ${hash} and signature is ${signature}`);
        var finalBlock = {
            ...this,
            Signature: signature,
            Hash: hash
        };
        //var finalJson = JSON.stringify(finalBlock);
        const finalJson = JSONbig.stringify(finalBlock);
        console.log("final block:", finalJson);
        return finalJson;
    }
}
export class SignedBlock extends Block {
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
export class CurrentServiceBlock extends SignedBlock {
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
export class TransactionBlock extends Block {
    constructor(blockData) {
        super(blockData);
        this.NonFungibleToken = undefined;
        if (blockData === undefined) {
            this.Balances = {};
            this.VoteFor = undefined;
        }
        else {
            const decodedBlockData = JSONbig.parse(blockData);
            this.AccountID = decodedBlockData.AccountID;
            this.Balances = {};
            for (const key in decodedBlockData.Balances) {
                this.Balances[key] = BigInt(decodedBlockData.Balances[key]);
            }
            if (decodedBlockData.VoteFor != null)
                this.VoteFor = decodedBlockData.VoteFor;
        }
    }
    toJson(wallet, sb) {
        // check balances to make sure they are valid
        for (const key in this.Balances) {
            if (this.Balances[key] < 0) {
                throw new Error("Balance is negative.");
            }
            if (this.Balances[key] > maxInt64) {
                throw new Error("Balance is too big.");
            }
        }
        this.AccountID = wallet.accountId;
        // setup service block related fields
        this.FeeCode = sb.FeeTicker;
        return super.toJson(wallet, sb);
    }
}
export class SendTransferBlock extends TransactionBlock {
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
        return BlockTypes.SendTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.Fee = sb.TransferFee;
        this.FeeType = AuthorizationFeeTypes.Regular;
        this.Balances[sb.FeeTicker] =
            this.Balances[sb.FeeTicker] - toBalanceBigInt(BigInt(sb.TransferFee));
        return super.toJson(wallet, sb);
    }
}
export class ReceiveTransferBlock extends TransactionBlock {
    constructor(blockData) {
        super(blockData);
    }
    GetBlockType() {
        return BlockTypes.ReceiveTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        if (this.BlockType == BlockTypes.ReceiveTransfer) {
            this.Fee = 0;
            this.FeeType = AuthorizationFeeTypes.NoFee;
        }
        return super.toJson(wallet, sb);
    }
}
export class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
    constructor(blockData) {
        super(blockData);
        if (blockData === undefined) {
            this.AccountType = AccountTypes.Standard;
        }
        else {
            throw new Error("Should not be called with blockData");
        }
    }
    GetBlockType() {
        return BlockTypes.OpenAccountWithReceiveTransfer;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        this.Fee = 0;
        this.FeeType = AuthorizationFeeTypes.NoFee;
        return super.toJson(wallet, sb);
    }
}
export class TokenGenesisBlock extends ReceiveTransferBlock {
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
        return BlockTypes.TokenGenesis;
    }
    toJson(wallet, sb) {
        // setup service block related fields
        //console.log("sb: ", sb);
        this.Fee = sb.TokenGenerationFee;
        this.FeeType = AuthorizationFeeTypes.Regular;
        this.Balances[sb.FeeTicker] -= BigInt(sb.TokenGenerationFee * LyraGlobal.BALANCERATIO);
        return super.toJson(wallet, sb);
    }
}
export class UniOrder {
}
export class UniTrade {
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
