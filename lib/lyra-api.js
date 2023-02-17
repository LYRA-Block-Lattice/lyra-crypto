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
const jsonrpc_client_websocket_1 = require("jsonrpc-client-websocket");
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createWS();
        });
    }
    createWS() {
        return __awaiter(this, void 0, void 0, function* () {
            var url = "wss://testnet.lyra.live/api/v1/socket";
            if (this.nodeAddress === undefined) {
                if (this.network === "mainnet") {
                    url = "wss://mainnet.lyra.live/api/v1/socket";
                }
                if (this.network === "devnet")
                    url = "wss://localhost:4504/api/v1/socket";
            }
            else {
                url = `wss://${this.nodeAddress}/api/v1/socket`;
            }
            console.log(`creating ws for ${this.network} using ${url}`);
            const requestTimeoutMs = 10000;
            this.ws = new jsonrpc_client_websocket_1.JsonRpcWebsocket(url, requestTimeoutMs, (error) => {
                console.log("websocket error", error);
                throw error;
            });
            try {
                yield this.ws.open();
            }
            catch (error) {
                console.log("error ws.open");
            }
            if (this.ws === null)
                // race condition
                return;
            this.ws.on("Notify", (news) => {
                switch (news.catalog) {
                    case "Receiving":
                        break;
                    case "Settlement":
                        break;
                    default:
                        break;
                }
                console.log("Got news notify", news);
            });
            this.ws.on("Sign", (hash, msg, accountId) => {
                console.log("Signing " + hash + " of " + msg + " for " + accountId);
                try {
                    var signt = lyra_crypto_1.LyraCrypto.Sign(msg, this.prvKey);
                    console.log("Signature", signt);
                    return ["der", signt];
                }
                catch (err) {
                    console.log("Error sign message", err);
                    return ["err", err.toString()];
                }
            });
            try {
                const response = yield this.ws.call("Status", ["3.6.6.0", this.network]);
                yield this.ws.call("Monitor", [this.accountId]);
            }
            catch (error) {
                console.log("ws init error", error);
            }
        });
    }
    send(amount, destAddr, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED) {
                    yield this.ws.open();
                }
                const balanceResp = yield this.ws.call("Send", [
                    this.accountId,
                    amount,
                    destAddr,
                    token
                ]);
                return balanceResp.result;
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
                if (this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED) {
                    yield this.ws.open();
                }
                const balanceResp = yield this.ws.call("Receive", [this.accountId]);
                return balanceResp.result;
            }
            catch (error) {
                console.log("ws receive error", error);
                throw error;
            }
        });
    }
    balance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED) {
                yield this.ws.open();
            }
            const balanceResp = yield this.ws.call("Balance", [this.accountId]);
            return balanceResp.result;
        });
    }
    history(startTimeUtc, endTimeUtc, count) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED) {
                    yield this.ws.open();
                }
                const histResult = yield this.ws.call("History", [
                    this.accountId,
                    startTimeUtc.getTime(),
                    endTimeUtc.getTime(),
                    count
                ]);
                return histResult.result;
            }
            catch (error) {
                console.log("ws history error", error);
                throw error;
            }
        });
    }
    close() {
        console.log("closing lyra-api");
        this.ws.close();
        this.accountId = "";
        this.prvKey = "";
    }
}
exports.LyraApi = LyraApi;
