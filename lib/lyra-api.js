"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraApi = void 0;
const uuid_1 = require("uuid");
const block_1 = require("./blocks/block");
const meta_1 = require("./blocks/meta");
const stringify = require("./my-json-stringify");
const lyra_crypto_1 = require("./lyra-crypto");
const blockchain_api_1 = require("./blockchain-api");
//import { dumpHttpError, extractStreamData } from "../utils";
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
        return new Promise(async (resolve, reject) => {
            try {
                const lastBlock = await blockchain_api_1.BlockchainAPI.GetLastBlock(this.accountId);
                if (lastBlock.resultCode !== 0) {
                    const errorMessage = `GetLastBlock failed with code ${lastBlock.resultCode}`;
                    throw new Error(errorMessage);
                }
                const lastServiceBlock = await blockchain_api_1.BlockchainAPI.getLastServiceBlock();
                const serviceBlockData = JSON.parse(lastServiceBlock.blockData);
                const sendBlock = new block_1.SendTransferBlock(lastBlock.blockData);
                const amountsArray = Object.entries(amounts);
                amountsArray.forEach(([key, value]) => {
                    if (sendBlock.Balances[key] < (0, block_1.numberToBalanceBigInt)(value))
                        throw new Error(`Insufficient balance for token ${key}.`);
                    sendBlock.Balances[key] =
                        sendBlock.Balances[key] - (0, block_1.numberToBalanceBigInt)(value);
                });
                sendBlock.DestinationAccountId = destinationAccountId;
                sendBlock.Tags = tags;
                const finalJson = sendBlock.toJson(this, serviceBlockData);
                const sendResult = await blockchain_api_1.BlockchainAPI.sendTransfer(finalJson);
                resolve(sendResult);
            }
            catch (error) {
                console.error(error);
                const errorMessage = `sendEx failed with error: ${error}`;
                //dumpHttpError(error);
                //console.error(errorMessage);
                //throw new Error(errorMessage);
                reject(new Error(errorMessage));
            }
        });
    }
    async send(amount, destAddr, token) {
        return await this.sendEx(destAddr, { [token]: amount }, undefined);
    }
    async receive(onNewBlock) {
        while (true) {
            try {
                var unrecv = await blockchain_api_1.BlockchainAPI.getUnreceived(this.accountId);
                //console.log("changes", unrecv);
                if (unrecv.resultCode == 0) {
                    // success.
                    var lsb = await blockchain_api_1.BlockchainAPI.getLastServiceBlock();
                    var sb = JSON.parse(lsb.blockData);
                    var ret = await blockchain_api_1.BlockchainAPI.GetLastBlock(this.accountId);
                    //console.log("last block", ret);
                    var receiveBlock = ret.resultCode == 0
                        ? new block_1.ReceiveTransferBlock(ret.blockData)
                        : new block_1.OpenWithReceiveTransferBlock(undefined);
                    receiveBlock.SourceHash = unrecv.sourceHash;
                    const changesArray = Object.entries(unrecv.transfer.changes);
                    //console.log("changesArray", changesArray);
                    changesArray.forEach(([key, value]) => {
                        if (key != undefined) {
                            if (receiveBlock.Balances.hasOwnProperty(key))
                                receiveBlock.Balances[key] += BigInt(value * 100000000);
                            else
                                receiveBlock.Balances[key] = BigInt(value * 100000000);
                        }
                    });
                    const finalJson = receiveBlock.toJson(this, sb);
                    console.log("receiveBlock", finalJson);
                    const recvret = ret.resultCode == 0
                        ? await blockchain_api_1.BlockchainAPI.recvTransfer(finalJson)
                        : await blockchain_api_1.BlockchainAPI.recvTransferWithOpenAccount(finalJson);
                    if (recvret.resultCode == 0) {
                        // continue to receive next block.
                        onNewBlock(receiveBlock);
                    }
                    else {
                        return recvret;
                    }
                }
                else {
                    // no new unreceived block.
                    return unrecv;
                }
            }
            catch (error) {
                console.log("receive error", error);
                throw error;
            }
        }
    }
    async balance() {
        try {
            var ret = await blockchain_api_1.BlockchainAPI.getBalance(this.accountId);
            let dictionary = Object.assign({}, ...ret.map((x) => ({ [x.Ticker]: x.Balance })));
            //console.log("dictionary", dictionary);
            return {
                data: ret,
                balance: dictionary
            };
        }
        catch (error) {
            console.log("node balance error", error);
        }
    }
    async history(start, end, count) {
        try {
            const hists = await blockchain_api_1.BlockchainAPI.getHistory(this.accountId, start, end, count);
            return hists;
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
            var ret = await blockchain_api_1.BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await blockchain_api_1.BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
            const ticker = domainName + "/" + tokenName;
            var gensBlock = new block_1.TokenGenesisBlock(ret.blockData);
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
            gensBlock.Icon = undefined;
            gensBlock.Image = undefined;
            gensBlock.Custom1 = undefined;
            gensBlock.Custom2 = undefined;
            gensBlock.Custom3 = undefined;
            gensBlock.Tags = tags;
            gensBlock.SourceHash = undefined;
            gensBlock.Balances[ticker] = BigInt(supply * block_1.LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await blockchain_api_1.BlockchainAPI.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async mintNFT(name, description, supply, metadataUri, owner) {
        try {
            var ret = await blockchain_api_1.BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await blockchain_api_1.BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
            const domainName = "nft";
            const ticker = domainName + "/" + (0, uuid_1.v4)();
            var gensBlock = new block_1.TokenGenesisBlock(ret.blockData);
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
            gensBlock.NonFungibleKey = undefined;
            gensBlock.IsNonFungible = true;
            gensBlock.Owner = owner;
            gensBlock.Address = undefined;
            gensBlock.Currency = undefined;
            gensBlock.Icon = undefined;
            gensBlock.Image = undefined;
            gensBlock.Custom1 = name;
            gensBlock.Custom2 = metadataUri;
            gensBlock.Custom3 = undefined;
            gensBlock.Tags = undefined;
            gensBlock.SourceHash = undefined;
            gensBlock.Balances[ticker] = BigInt(supply * block_1.LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await blockchain_api_1.BlockchainAPI.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async createTOT(type, name, description, supply, metadataUri, descSignature, owner) {
        try {
            var ret = await blockchain_api_1.BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await blockchain_api_1.BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
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
            var gensBlock = new block_1.TokenGenesisBlock(ret.blockData);
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
            gensBlock.Address = undefined;
            gensBlock.Currency = undefined;
            gensBlock.Icon = undefined;
            gensBlock.Image = undefined;
            gensBlock.Custom1 = name;
            gensBlock.Custom2 = metadataUri;
            gensBlock.Custom3 = descSignature;
            gensBlock.Tags = undefined;
            gensBlock.SourceHash = undefined;
            gensBlock.Balances[ticker] = BigInt(supply * block_1.LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await blockchain_api_1.BlockchainAPI.mintToken(finalJson);
            //console.log("sendRet", sendRet);
            return sendRet;
        }
        catch (error) {
            console.log("mintToken error", error);
            throw error;
        }
    }
    async serviceRequestAsync(type, arg) {
        const tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: arg.svcReq,
            objType: type,
            data: JSON.stringify(arg.objArgument)
        };
        const result = await this.sendEx(arg.targetAccountId, arg.amounts, tags);
        return result;
    }
    async createFiatWalletAsync(symbol) {
        const existsWalletRet = await blockchain_api_1.BlockchainAPI.findFiatWallet(this.accountId, symbol);
        if (existsWalletRet.resultCode != 0) {
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
            const result = await this.serviceRequestAsync("FiatCreateWallet", crwlt);
            return result;
        }
        return existsWalletRet;
    }
    async printFiat(symbol, count) {
        const existsWalletRet = await blockchain_api_1.BlockchainAPI.findFiatWallet(this.accountId, symbol);
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
        const result2 = this.serviceRequestAsync("FiatPrintMoney", printMoney);
        return result2;
    }
    async createOrder(order) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_CRODR,
            data: stringify(order)
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
        return this.sendEx(order.daoId, amounts, tags);
    }
    async createTrade(trade) {
        let tags = {
            [block_1.LyraGlobal.REQSERVICETAG]: meta_1.BrokerActions.BRK_UNI_CRTRD,
            data: stringify(trade)
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
        return this.sendEx(trade.daoId, amounts, tags);
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
        return this.sendEx(daoId, amounts, tags);
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
        return this.sendEx(daoId, amounts, tags);
    }
}
exports.LyraApi = LyraApi;
