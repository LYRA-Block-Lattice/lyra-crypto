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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraApi = void 0;
var jsonrpc_client_websocket_1 = require("jsonrpc-client-websocket");
var lyra_crypto_1 = require("./lyra-crypto");
var LyraApi = /** @class */ (function () {
    function LyraApi(network, privateKey, node) {
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
    LyraApi.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createWS()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LyraApi.prototype.createWS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, requestTimeoutMs, error_1, response, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "wss://testnet.lyra.live/api/v1/socket";
                        if (this.nodeAddress === undefined) {
                            if (this.network === "mainnet") {
                                url = "wss://mainnet.lyra.live/api/v1/socket";
                            }
                            if (this.network === "devnet")
                                url = "wss://localhost:4504/api/v1/socket";
                        }
                        else {
                            url = "wss://" + this.nodeAddress + "/api/v1/socket";
                        }
                        console.log("creating ws for " + this.network + " using " + url);
                        requestTimeoutMs = 10000;
                        this.ws = new jsonrpc_client_websocket_1.JsonRpcWebsocket(url, requestTimeoutMs, function (error) {
                            console.log("websocket error", error);
                            throw error;
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.ws.open()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log("error ws.open");
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.ws === null)
                            // race condition
                            return [2 /*return*/];
                        this.ws.on("Notify", function (news) {
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
                        this.ws.on("Sign", function (hash, msg, accountId) {
                            console.log("Signing " + hash + " of " + msg + " for " + accountId);
                            try {
                                var signt = lyra_crypto_1.LyraCrypto.Sign(msg, _this.prvKey);
                                console.log("Signature", signt);
                                return ["der", signt];
                            }
                            catch (err) {
                                console.log("Error sign message", err);
                                return ["err", err.toString()];
                            }
                        });
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 8, , 9]);
                        return [4 /*yield*/, this.ws.call("Status", ["2.2.0.0", this.network])];
                    case 6:
                        response = _a.sent();
                        return [4 /*yield*/, this.ws.call("Monitor", [this.accountId])];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.log("ws init error", error_2);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    LyraApi.prototype.send = function (destAddr, amount, token) {
        return __awaiter(this, void 0, void 0, function () {
            var balanceResp, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ws.open()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.ws.call("Send", [
                            this.accountId,
                            amount,
                            destAddr,
                            token
                        ])];
                    case 3:
                        balanceResp = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.log("ws send error", error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LyraApi.prototype.receive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceResp, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ws.open()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.ws.call("Receive", [this.accountId])];
                    case 3:
                        balanceResp = _a.sent();
                        return [2 /*return*/, balanceResp];
                    case 4:
                        error_4 = _a.sent();
                        console.log("ws receive error", error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LyraApi.prototype.balance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceResp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.ws.state === jsonrpc_client_websocket_1.WebsocketReadyStates.CLOSED)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ws.open()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.ws.call("Balance", [this.accountId])];
                    case 3:
                        balanceResp = _a.sent();
                        return [2 /*return*/, balanceResp];
                }
            });
        });
    };
    LyraApi.prototype.close = function () {
        console.log("closing lyra-api");
        this.ws.close();
        this.accountId = "";
        this.prvKey = "";
    };
    return LyraApi;
}());
exports.LyraApi = LyraApi;
