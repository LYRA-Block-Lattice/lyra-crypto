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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraApi = void 0;
const axios_1 = require("axios");
const uuid_1 = require("uuid");
const block_1 = require("./blocks/block");
const meta_1 = require("./blocks/meta");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
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
    async sendEx(destinationAccountId, amounts, tags) {
        // function body
        try {
            var ret = await nodeApi.GetLastBlock(this.accountId);
            if (ret.data.resultCode != 0) {
                throw new Error("GetLastBlock failed: " + ret.data.resultCode);
            }
            var lsb = await nodeApi.getLastServiceBlock();
            var sb = JSON.parse(lsb.data.blockData);
            var sendBlock = new block_1.SendTransferBlock(ret.data.blockData);
            const amountsArray = Object.entries(amounts);
            amountsArray.forEach(([key, value]) => {
                sendBlock.Balances[key] -= value * block_1.LyraGlobal.BALANCERATIO;
            });
            sendBlock.DestinationAccountId = destinationAccountId;
            sendBlock.Tags = tags;
            const finalJson = sendBlock.toJson(this, sb);
            //console.log("sendBlock", finalJson);
            var sendRet = await nodeApi.sendTransfer(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet.data;
        }
        catch (error) {
            console.log("send error", error);
            throw error;
        }
    }
    async send(amount, destAddr, token) {
        return await this.sendEx(destAddr, { [token]: amount }, null);
    }
    async receive() {
        while (true) {
            try {
                var unrecv = await nodeApi.getUnreceived(this.accountId);
                //console.log("changes", unrecv.data);
                if (unrecv.data.resultCode == 0) {
                    // success.
                    var lsb = await nodeApi.getLastServiceBlock();
                    var sb = JSON.parse(lsb.data.blockData);
                    var ret = await nodeApi.GetLastBlock(this.accountId);
                    //console.log("last block", ret.data);
                    var receiveBlock = ret.data.resultCode == 0
                        ? new block_1.ReceiveTransferBlock(ret.data.blockData)
                        : new block_1.OpenWithReceiveTransferBlock(undefined);
                    receiveBlock.SourceHash = unrecv.data.sourceHash;
                    const changesArray = Object.entries(unrecv.data.transfer.changes);
                    //console.log("changesArray", changesArray);
                    changesArray.forEach(([key, value]) => {
                        if (key != undefined) {
                            if (receiveBlock.Balances.hasOwnProperty(key))
                                receiveBlock.Balances[key] += value * 100000000;
                            else
                                receiveBlock.Balances[key] = value * 100000000;
                        }
                    });
                    const finalJson = receiveBlock.toJson(this, sb);
                    console.log("receiveBlock", finalJson);
                    const recvret = ret.data.resultCode == 0
                        ? await nodeApi.recvTransfer(finalJson)
                        : await nodeApi.recvTransferWithOpenAccount(finalJson);
                    if (recvret.data.resultCode == 0) {
                        // continue to receive next block.
                    }
                    else {
                        return recvret.data;
                    }
                }
                else {
                    // no new unreceived block.
                    return unrecv.data;
                }
            }
            catch (error) {
                console.log("receive error", error);
                if (error instanceof axios_1.AxiosError) {
                    console.log("detailed AxiosError", error.response?.data.errors);
                }
                throw error;
            }
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
    async history(start, end, count) {
        try {
            const hists = await nodeApi.getHistory(this.accountId, start, end, count);
            return hists.data;
        }
        catch (error) {
            console.log("history error", error);
            throw error;
        }
    }
    close() {
        console.log("closing lyra-api");
        this.accountId = "";
        this.prvKey = "";
    }
    async mintToken(tokenName, domainName, description, precision, supply, isFinalSupply, owner, // shop name
    address, // shop URL
    currency, // USD
    contractType, // reward or discount or custom
    tags) {
        try {
            var ret = await nodeApi.GetLastBlock(this.accountId);
            var lsb = await nodeApi.getLastServiceBlock();
            var sb = JSON.parse(lsb.data.blockData);
            const ticker = domainName + "/" + tokenName;
            var gensBlock = new block_1.TokenGenesisBlock(ret.data.blockData);
            gensBlock.Ticker = ticker;
            gensBlock.DomainName = domainName;
            gensBlock.ContractType = contractType;
            let currentDate = new Date();
            // Set the year to 100 years later
            currentDate.setFullYear(currentDate.getFullYear() + 100);
            gensBlock.RenewalDate = currentDate;
            gensBlock.Edition = 1;
            gensBlock.Description = description;
            gensBlock.Precision = precision;
            gensBlock.IsFinalSupply = isFinalSupply;
            gensBlock.NonFungibleType = 0;
            gensBlock.NonFungibleKey = "";
            gensBlock.Owner = owner;
            gensBlock.Address = address;
            gensBlock.Currency = currency;
            gensBlock.Icon = null;
            gensBlock.Image = null;
            gensBlock.Custom1 = null;
            gensBlock.Custom2 = null;
            gensBlock.Custom3 = null;
            gensBlock.Tags = tags;
            gensBlock.SourceHash = null;
            gensBlock.Balances[ticker] = supply * block_1.LyraGlobal.BALANCERATIO;
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await nodeApi.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet.data;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async mintNFT(name, description, supply, metadataUri, owner) {
        try {
            var ret = await nodeApi.GetLastBlock(this.accountId);
            var lsb = await nodeApi.getLastServiceBlock();
            var sb = JSON.parse(lsb.data.blockData);
            const domainName = "nft";
            const ticker = domainName + "/" + (0, uuid_1.v4)();
            var gensBlock = new block_1.TokenGenesisBlock(ret.data.blockData);
            gensBlock.Ticker = ticker;
            gensBlock.DomainName = domainName;
            gensBlock.ContractType = meta_1.ContractTypes.Collectible;
            let currentDate = new Date();
            // Set the year to 100 years later
            currentDate.setFullYear(currentDate.getFullYear() + 100);
            gensBlock.RenewalDate = currentDate;
            gensBlock.Edition = 1;
            gensBlock.Description = description;
            gensBlock.Precision = 0;
            gensBlock.IsFinalSupply = true;
            gensBlock.NonFungibleType = meta_1.NonFungibleTokenTypes.Collectible;
            gensBlock.NonFungibleKey = "";
            gensBlock.Owner = owner;
            gensBlock.Address = null;
            gensBlock.Currency = null;
            gensBlock.Icon = null;
            gensBlock.Image = null;
            gensBlock.Custom1 = name;
            gensBlock.Custom2 = metadataUri;
            gensBlock.Custom3 = null;
            gensBlock.Tags = null;
            gensBlock.SourceHash = null;
            gensBlock.Balances[ticker] = supply * block_1.LyraGlobal.BALANCERATIO;
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await nodeApi.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet.data;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async createTOT(type, name, description, supply, metadataUri, descSignature, owner) {
        try {
            var ret = await nodeApi.GetLastBlock(this.accountId);
            var lsb = await nodeApi.getLastServiceBlock();
            var sb = JSON.parse(lsb.data.blockData);
            const domainName = (() => {
                switch (type) {
                    case meta_1.HoldTypes.NFT:
                        return "nft";
                    case meta_1.HoldTypes.Fiat:
                        return "fiat";
                    case meta_1.HoldTypes.SVC:
                        return "svc";
                    default:
                        return "tot";
                }
            })();
            const ticker = domainName + "/" + (0, uuid_1.v4)();
            var gensBlock = new block_1.TokenGenesisBlock(ret.data.blockData);
            gensBlock.Ticker = ticker;
            gensBlock.DomainName = domainName;
            gensBlock.ContractType = meta_1.ContractTypes.TradeOnlyToken;
            let currentDate = new Date();
            // Set the year to 100 years later
            currentDate.setFullYear(currentDate.getFullYear() + 100);
            gensBlock.RenewalDate = currentDate;
            gensBlock.Edition = 1;
            gensBlock.Description = description;
            gensBlock.Precision = 0;
            gensBlock.IsFinalSupply = true;
            gensBlock.NonFungibleType = meta_1.NonFungibleTokenTypes.TradeOnly;
            gensBlock.NonFungibleKey = "";
            gensBlock.Owner = owner;
            gensBlock.Address = null;
            gensBlock.Currency = null;
            gensBlock.Icon = null;
            gensBlock.Image = null;
            gensBlock.Custom1 = name;
            gensBlock.Custom2 = metadataUri;
            gensBlock.Custom3 = descSignature;
            gensBlock.Tags = null;
            gensBlock.SourceHash = null;
            gensBlock.Balances[ticker] = supply * block_1.LyraGlobal.BALANCERATIO;
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await nodeApi.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet.data;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async serviceRequestAsync(arg) {
        const tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: arg.svcReq,
            objType: arg.objArgument.constructor.name,
            data: JSON.stringify(arg.objArgument)
        };
        const result = await this.sendEx(arg.targetAccountId, arg.amounts, tags);
        return result;
    }
    async createFiatWalletAsync(symbol) {
        const existsWalletRet = await nodeApi.findFiatWallet(this.accountId, symbol);
        if (existsWalletRet.data.resultCode != 0) {
            const crwlt = {
                svcReq: meta_1.BrokerActions.BRK_FIAT_CRACT,
                targetAccountId: block_1.LyraGlobal.GUILDACCOUNTID,
                amounts: {
                    [block_1.LyraGlobal.OFFICIALTICKERCODE]: 1
                },
                objArgument: {
                    symbol: symbol
                }
            };
            const result = await this.serviceRequestAsync(crwlt);
            return result;
        }
        return existsWalletRet.data;
    }
    async printFiat(symbol, count) {
        const existsWalletRet = await nodeApi.findFiatWallet(this.accountId, symbol);
        const printMoney = {
            svcReq: meta_1.BrokerActions.BRK_FIAT_PRINT,
            targetAccountId: block_1.LyraGlobal.GUILDACCOUNTID,
            amounts: {
                [block_1.LyraGlobal.OFFICIALTICKERCODE]: 1
            },
            objArgument: {
                symbol: symbol,
                amount: count
            }
        };
        const result2 = await this.serviceRequestAsync(printMoney);
        return result2;
    }
    async createUniOrder(order) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_CRODR,
            data: (0, json_stable_stringify_1.default)(order)
        };
        let amounts = {};
        if (order.offering == block_1.LyraGlobal.OFFICIALTICKERCODE) {
            //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
            amounts = {
                [block_1.LyraGlobal.OFFICIALTICKERCODE]: order.amount + block_1.LyraGlobal.GetListingFeeFor() + order.cltamt
            };
        }
        else {
            //amounts.set(order.offering, order.amount);
            amounts = {
                [block_1.LyraGlobal.OFFICIALTICKERCODE]: block_1.LyraGlobal.GetListingFeeFor() + order.cltamt,
                [order.offering]: order.amount
            };
        }
        return await this.sendEx(order.daoId, amounts, tags);
    }
    async createUniTrade(trade) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_CRTRD,
            data: (0, json_stable_stringify_1.default)(trade)
        };
        let amounts = {};
        if (trade.biding == block_1.LyraGlobal.OFFICIALTICKERCODE) {
            //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
            amounts = {
                [block_1.LyraGlobal.OFFICIALTICKERCODE]: trade.pay + trade.cltamt
            };
        }
        else {
            //amounts.set(order.offering, order.amount);
            amounts = {
                [block_1.LyraGlobal.OFFICIALTICKERCODE]: trade.cltamt,
                [trade.biding]: trade.pay
            };
        }
        return await this.sendEx(trade.daoId, amounts, tags);
    }
    async DelistUniOrder(daoId, orderId) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_ORDDELST,
            daoid: daoId,
            orderid: orderId
        };
        let amounts = {
            [block_1.LyraGlobal.OFFICIALTICKERCODE]: 1
        };
        return await this.sendEx(daoId, amounts, tags);
    }
    async CloseUniOrder(daoId, orderId) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_ORDCLOSE,
            daoid: daoId,
            orderid: orderId
        };
        let amounts = {
            [block_1.LyraGlobal.OFFICIALTICKERCODE]: 1
        };
        return await this.sendEx(daoId, amounts, tags);
    }
}
exports.LyraApi = LyraApi;
