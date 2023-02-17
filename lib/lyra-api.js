"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraApi = void 0;
const lyra_crypto_1 = require("./lyra-crypto");
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
    send(amount, destAddr, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // if (this.ws.state === WebsocketReadyStates.CLOSED) {
                //   await this.ws.open();
                // }
                // const balanceResp = await this.ws.call("Send", [
                //   this.accountId,
                //   amount,
                //   destAddr,
                //   token
                // ]);
                // return balanceResp.result;
            }
            catch (error) {
                console.log("ws send error", error);
                throw error;
            }
        });
    }
    receive() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            // if (this.ws.state === WebsocketReadyStates.CLOSED) {
            //   await this.ws.open();
            // }
            // const balanceResp = await this.ws.call("Balance", [this.accountId]);
            // return balanceResp.result;
        });
    }
    history(startTimeUtc, endTimeUtc, count) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    close() {
        console.log("closing lyra-api");
        this.accountId = "";
        this.prvKey = "";
    }
}
exports.LyraApi = LyraApi;
