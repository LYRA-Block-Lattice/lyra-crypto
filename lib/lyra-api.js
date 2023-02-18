"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraApi = void 0;
const block_1 = require("./blocks/block");
const lyra_crypto_1 = require("./lyra-crypto");
const nodeApi = __importStar(require("./node-api"));
class LyraApi {
    constructor(network, privateKey, node) {
        this.network = network;
        this.nodeAddress = node;
        this.prvKey = privateKey;
        if (!lyra_crypto_1.LyraCrypto.isPrivateKeyValid(this.prvKey)) {
            throw new Error("private key is invalid.");
        }
        else {
            var actId = lyra_crypto_1.LyraCrypto.GetAccountIdFromPrivateKey(this.prvKey);
            if (actId === undefined) {
                throw new Error("can't get account id from private key.");
            }
            else {
                this.accountId = actId;
            }
        }
    }
    init() { }
    sign(data) {
        return lyra_crypto_1.LyraCrypto.Sign(data, this.prvKey);
    }
    async send(amount, destAddr, token) {
        try {
            var ret = await nodeApi.GetLastBlock(this.accountId);
            var lsb = await nodeApi.lastServiceHash();
            var sendBlock = new block_1.SendTransferBlock(ret.data.blockData);
            sendBlock.Balances[token] -= amount * 600000000;
            sendBlock.ServiceHash = lsb.data;
            sendBlock.DestinationAccountId = destAddr;
            const finalJson = sendBlock.toJson(this);
            console.log("sendBlock", finalJson);
            var sendRet = await nodeApi.sendTransfer(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet.data;
        }
        catch (error) {
            console.log("send error", error);
            throw error;
        }
    }
    async receive() {
        try {
            // if (this.ws.state === WebsocketReadyStates.CLOSED) {
            //   await this.ws.open();
            // }
            // const balanceResp = await this.ws.call("Receive", [this.accountId]);
            // return balanceResp.result;
        }
        catch (error) {
            console.log("ws receive error", error);
            throw error;
        }
    }
    async balance() {
        try {
            var ret = await nodeApi.getBalance(this.accountId);
            let dictionary = Object.assign({}, ...ret.data.map((x) => ({ [x.Ticker]: x.Balance })));
            //console.log("dictionary", dictionary);
            return {
                data: ret.data,
                balance: dictionary
            };
        }
        catch (error) {
            console.log("node balance error", error);
        }
    }
    async history(startTimeUtc, endTimeUtc, count) {
        try {
            // if (this.ws.state === WebsocketReadyStates.CLOSED) {
            //   await this.ws.open();
            // }
            // const histResult = await this.ws.call("History", [
            //   this.accountId,
            //   startTimeUtc.getTime(),
            //   endTimeUtc.getTime(),
            //   count
            // ]);
            // return histResult.result;
        }
        catch (error) {
            console.log("ws history error", error);
            throw error;
        }
    }
    close() {
        console.log("closing lyra-api");
        this.accountId = "";
        this.prvKey = "";
    }
}
exports.LyraApi = LyraApi;
