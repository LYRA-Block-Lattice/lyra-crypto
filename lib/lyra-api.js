import { v4 as uuidv4 } from "uuid";
import { LyraGlobal, numberToBalanceBigInt, OpenWithReceiveTransferBlock, ReceiveTransferBlock, SendTransferBlock, TokenGenesisBlock } from "./blocks/block";
import { BrokerActions, ContractTypes, HoldTypes, NonFungibleTokenTypes } from "./blocks/meta";
import stringify from "./my-json-stringify";
import { LyraCrypto } from "./lyra-crypto";
import { BlockchainAPI } from "./blockchain-api";
//import { dumpHttpError, extractStreamData } from "../utils";
export class LyraApi {
    constructor(network, privateKey, node) {
        this.network = network;
        this.nodeAddress = node;
        this.prvKey = privateKey;
        if (!LyraCrypto.isPrivateKeyValid(this.prvKey)) {
            throw new Error("private key is invalid.");
        }
        else {
            var actId = LyraCrypto.GetAccountIdFromPrivateKey(this.prvKey);
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
        return LyraCrypto.Sign(data, this.prvKey);
    }
    async sendEx(destinationAccountId, amounts, tags) {
        return new Promise(async (resolve, reject) => {
            try {
                const lastBlock = await BlockchainAPI.GetLastBlock(this.accountId);
                if (lastBlock.resultCode !== 0) {
                    const errorMessage = `GetLastBlock failed with code ${lastBlock.resultCode}`;
                    throw new Error(errorMessage);
                }
                const lastServiceBlock = await BlockchainAPI.getLastServiceBlock();
                const serviceBlockData = JSON.parse(lastServiceBlock.blockData);
                const sendBlock = new SendTransferBlock(lastBlock.blockData);
                const amountsArray = Object.entries(amounts);
                amountsArray.forEach(([key, value]) => {
                    if (sendBlock.Balances[key] < numberToBalanceBigInt(value))
                        throw new Error(`Insufficient balance for token ${key}.`);
                    sendBlock.Balances[key] =
                        sendBlock.Balances[key] - numberToBalanceBigInt(value);
                });
                sendBlock.DestinationAccountId = destinationAccountId;
                sendBlock.Tags = tags;
                const finalJson = sendBlock.toJson(this, serviceBlockData);
                const sendResult = await BlockchainAPI.sendTransfer(finalJson);
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
                var unrecv = await BlockchainAPI.getUnreceived(this.accountId);
                //console.log("changes", unrecv);
                if (unrecv.resultCode == 0) {
                    // success.
                    var lsb = await BlockchainAPI.getLastServiceBlock();
                    var sb = JSON.parse(lsb.blockData);
                    var ret = await BlockchainAPI.GetLastBlock(this.accountId);
                    //console.log("last block", ret);
                    var receiveBlock = ret.resultCode == 0
                        ? new ReceiveTransferBlock(ret.blockData)
                        : new OpenWithReceiveTransferBlock(undefined);
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
                        ? await BlockchainAPI.recvTransfer(finalJson)
                        : await BlockchainAPI.recvTransferWithOpenAccount(finalJson);
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
            var ret = await BlockchainAPI.getBalance(this.accountId);
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
            const hists = await BlockchainAPI.getHistory(this.accountId, start, end, count);
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
            var ret = await BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
            const ticker = domainName + "/" + tokenName;
            var gensBlock = new TokenGenesisBlock(ret.blockData);
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
            gensBlock.Balances[ticker] = BigInt(supply * LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await BlockchainAPI.mintToken(finalJson);
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
            var ret = await BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
            const domainName = "nft";
            const ticker = domainName + "/" + uuidv4();
            var gensBlock = new TokenGenesisBlock(ret.blockData);
            gensBlock.Ticker = ticker;
            gensBlock.DomainName = domainName;
            gensBlock.ContractType = ContractTypes.Collectible;
            let currentDate = new Date();
            // Set the year to 100 years later
            currentDate.setFullYear(currentDate.getFullYear() + 100);
            gensBlock.RenewalDate = currentDate;
            gensBlock.Edition = 1;
            gensBlock.Description = description;
            gensBlock.Precision = 0;
            gensBlock.IsFinalSupply = true;
            gensBlock.NonFungibleType = NonFungibleTokenTypes.Collectible;
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
            gensBlock.Balances[ticker] = BigInt(supply * LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await BlockchainAPI.mintToken(finalJson);
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
            var ret = await BlockchainAPI.GetLastBlock(this.accountId);
            var lsb = await BlockchainAPI.getLastServiceBlock();
            var sb = JSON.parse(lsb.blockData);
            const domainName = (() => {
                switch (type) {
                    case HoldTypes.NFT:
                        return "nft";
                    case HoldTypes.Fiat:
                        return "fiat";
                    case HoldTypes.SVC:
                        return "svc";
                    default:
                        return "tot";
                }
            })();
            const ticker = domainName + "/" + uuidv4();
            var gensBlock = new TokenGenesisBlock(ret.blockData);
            gensBlock.Ticker = ticker;
            gensBlock.DomainName = domainName;
            gensBlock.ContractType = ContractTypes.TradeOnlyToken;
            let currentDate = new Date();
            // Set the year to 100 years later
            currentDate.setFullYear(currentDate.getFullYear() + 100);
            gensBlock.RenewalDate = currentDate;
            gensBlock.Edition = 1;
            gensBlock.Description = description;
            gensBlock.Precision = 0;
            gensBlock.IsFinalSupply = true;
            gensBlock.NonFungibleType = NonFungibleTokenTypes.TradeOnly;
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
            gensBlock.Balances[ticker] = BigInt(supply * LyraGlobal.BALANCERATIO);
            const finalJson = gensBlock.toJson(this, sb);
            console.log("sendBlock", finalJson);
            var sendRet = await BlockchainAPI.mintToken(finalJson);
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
            [LyraGlobal.REQSERVICETAG]: arg.svcReq,
            objType: type,
            data: JSON.stringify(arg.objArgument)
        };
        const result = await this.sendEx(arg.targetAccountId, arg.amounts, tags);
        return result;
    }
    async createFiatWalletAsync(symbol) {
        const existsWalletRet = await BlockchainAPI.findFiatWallet(this.accountId, symbol);
        if (existsWalletRet.resultCode != 0) {
            const crwlt = {
                svcReq: BrokerActions.BRK_FIAT_CRACT,
                targetAccountId: LyraGlobal.GUILDACCOUNTID,
                amounts: {
                    [LyraGlobal.OFFICIALTICKERCODE]: 1
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
        const existsWalletRet = await BlockchainAPI.findFiatWallet(this.accountId, symbol);
        const printMoney = {
            svcReq: BrokerActions.BRK_FIAT_PRINT,
            targetAccountId: LyraGlobal.GUILDACCOUNTID,
            amounts: {
                [LyraGlobal.OFFICIALTICKERCODE]: 1
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
            [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_CRODR,
            data: stringify(order)
        };
        let amounts = {};
        if (order.offering == LyraGlobal.OFFICIALTICKERCODE) {
            //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
            amounts = {
                [LyraGlobal.OFFICIALTICKERCODE]: order.amount + LyraGlobal.GetListingFeeFor() + order.cltamt
            };
        }
        else {
            //amounts.set(order.offering, order.amount);
            amounts = {
                [LyraGlobal.OFFICIALTICKERCODE]: LyraGlobal.GetListingFeeFor() + order.cltamt,
                [order.offering]: order.amount
            };
        }
        return this.sendEx(order.daoId, amounts, tags);
    }
    async createTrade(trade) {
        let tags = {
            [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_CRTRD,
            data: stringify(trade)
        };
        let amounts = {};
        if (trade.biding == LyraGlobal.OFFICIALTICKERCODE) {
            //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
            amounts = {
                [LyraGlobal.OFFICIALTICKERCODE]: trade.pay + trade.cltamt
            };
        }
        else {
            //amounts.set(order.offering, order.amount);
            amounts = {
                [LyraGlobal.OFFICIALTICKERCODE]: trade.cltamt,
                [trade.biding]: trade.pay
            };
        }
        return this.sendEx(trade.daoId, amounts, tags);
    }
    async DelistUniOrder(daoId, orderId) {
        let tags = {
            [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_ORDDELST,
            daoid: daoId,
            orderid: orderId
        };
        let amounts = {
            [LyraGlobal.OFFICIALTICKERCODE]: 1
        };
        return this.sendEx(daoId, amounts, tags);
    }
    async CloseUniOrder(daoId, orderId) {
        let tags = {
            [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_ORDCLOSE,
            daoid: daoId,
            orderid: orderId
        };
        let amounts = {
            [LyraGlobal.OFFICIALTICKERCODE]: 1
        };
        return this.sendEx(daoId, amounts, tags);
    }
}
