import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  LyraGlobal,
  OpenWithReceiveTransferBlock,
  ReceiveTransferBlock,
  SendTransferBlock,
  TokenGenesisBlock,
  UniOrder,
  UniTrade
} from "./blocks/block";
import {
  Amounts,
  APIResult,
  AuthorizationAPIResult,
  BrokerActions,
  ContractTypes,
  HoldTypes,
  LyraContractABI,
  NonFungibleTokenTypes,
  Tags
} from "./blocks/meta";
import stringify from "json-stable-stringify";

import { LyraCrypto } from "./lyra-crypto";
import { BlockchainAPI } from "./blockchain-api";

export class LyraApi {
  private network: string;
  private nodeAddress?: string;
  private prvKey: string;
  accountId: string;

  constructor(network: string, privateKey: string, node?: string) {
    this.network = network;
    this.nodeAddress = node;
    this.prvKey = privateKey;

    if (!LyraCrypto.isPrivateKeyValid(this.prvKey)) {
      throw new Error("private key is invalid.");
    } else {
      var actId = LyraCrypto.GetAccountIdFromPrivateKey(this.prvKey);
      if (actId === undefined) {
        throw new Error("can't get account id from private key.");
      } else {
        this.accountId = actId;
      }
    }
  }

  init() {}

  sign(data: string) {
    return LyraCrypto.Sign(data, this.prvKey);
  }

  async sendEx(
    destinationAccountId: string,
    amounts: { [key: string]: number },
    tags: { [key: string]: string } | null
  ): Promise<AuthorizationAPIResult> {
    // function body
    try {
      var ret = await BlockchainAPI.GetLastBlock(this.accountId);
      if (ret.resultCode != 0) {
        throw new Error("GetLastBlock failed: " + ret.resultCode);
      }
      var lsb = await BlockchainAPI.getLastServiceBlock();
      var sb = JSON.parse(lsb.blockData);

      var sendBlock = new SendTransferBlock(ret.blockData);
      const amountsArray: [string, number][] = Object.entries(amounts);
      amountsArray.forEach(([key, value]) => {
        sendBlock.Balances[key] -= value * LyraGlobal.BALANCERATIO;
      });
      sendBlock.DestinationAccountId = destinationAccountId;
      sendBlock.Tags = tags;

      const finalJson = sendBlock.toJson(this, sb);
      //console.log("sendBlock", finalJson);

      var sendRet = await BlockchainAPI.sendTransfer(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet;
    } catch (error) {
      console.log("send error", error);
      throw error;
    }
  }

  async send(amount: number, destAddr: string, token: string) {
    return await this.sendEx(destAddr, { [token]: amount }, null);
  }

  async receive() {
    while (true) {
      try {
        var unrecv = await BlockchainAPI.getUnreceived(this.accountId);
        //console.log("changes", unrecv.data);

        if (unrecv.resultCode == 0) {
          // success.
          var lsb = await BlockchainAPI.getLastServiceBlock();
          var sb = JSON.parse(lsb.blockData);

          var ret = await BlockchainAPI.GetLastBlock(this.accountId);
          //console.log("last block", ret.data);
          var receiveBlock =
            ret.resultCode == 0
              ? new ReceiveTransferBlock(ret.blockData)
              : new OpenWithReceiveTransferBlock(undefined);

          receiveBlock.SourceHash = unrecv.data.sourceHash;

          const changesArray: [string, number][] = Object.entries(
            unrecv.data.transfer.changes
          );
          //console.log("changesArray", changesArray);
          changesArray.forEach(([key, value]) => {
            if (key != undefined) {
              if (receiveBlock.Balances.hasOwnProperty(key))
                receiveBlock.Balances[key] += value * 100000000;
              else receiveBlock.Balances[key] = value * 100000000;
            }
          });

          const finalJson = receiveBlock.toJson(this, sb);
          console.log("receiveBlock", finalJson);
          const recvret =
            ret.resultCode == 0
              ? await BlockchainAPI.recvTransfer(finalJson)
              : await BlockchainAPI.recvTransferWithOpenAccount(finalJson);

          if (recvret.resultCode == 0) {
            // continue to receive next block.
          } else {
            return recvret;
          }
        } else {
          // no new unreceived block.
          return unrecv.data;
        }
      } catch (error) {
        console.log("receive error", error);
        if (error instanceof AxiosError) {
          console.log("detailed AxiosError", error.response?.data.errors);
        }

        throw error;
      }
    }
  }

  async balance() {
    try {
      var ret = await BlockchainAPI.getBalance(this.accountId);

      let dictionary = Object.assign(
        {},
        ...ret.data.map((x: any) => ({ [x.Ticker]: x.Balance }))
      );
      //console.log("dictionary", dictionary);

      return {
        data: ret.data,
        balance: dictionary
      };
    } catch (error) {
      console.log("node balance error", error);
    }
  }

  async history(start: Date, end: Date, count: number) {
    try {
      const hists = await BlockchainAPI.getHistory(
        this.accountId,
        start,
        end,
        count
      );
      return hists.data;
    } catch (error) {
      console.log("history error", error);
      throw error;
    }
  }

  close() {
    console.log("closing lyra-api");
    this.accountId = "";
    this.prvKey = "";
  }

  async mintToken(
    tokenName: string,
    domainName: string,
    description: string,
    precision: number,
    supply: number,
    isFinalSupply: boolean,
    owner: string | null, // shop name
    address: string | null, // shop URL
    currency: string | null, // USD
    contractType: ContractTypes, // reward or discount or custom
    tags: Record<string, string> | null
  ) {
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
      gensBlock.Icon = null;
      gensBlock.Image = null;
      gensBlock.Custom1 = null;
      gensBlock.Custom2 = null;
      gensBlock.Custom3 = null;
      gensBlock.Tags = tags;
      gensBlock.SourceHash = null;

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await BlockchainAPI.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet;
    } catch (error) {
      console.log("mintToken error", error);
      throw error;
    }
  }

  async mintNFT(
    name: string,
    description: string,
    supply: number,
    metadataUri: string,
    owner: string | null
  ) {
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

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await BlockchainAPI.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet;
    } catch (error) {
      console.log("mintToken error", error);
      throw error;
    }
  }

  async createTOT(
    type: HoldTypes,
    name: string,
    description: string,
    supply: number,
    metadataUri: string,
    descSignature: string,
    owner: string | null
  ): Promise<AuthorizationAPIResult> {
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
      gensBlock.Address = null;
      gensBlock.Currency = null;
      gensBlock.Icon = null;
      gensBlock.Image = null;
      gensBlock.Custom1 = name;
      gensBlock.Custom2 = metadataUri;
      gensBlock.Custom3 = descSignature;
      gensBlock.Tags = null;
      gensBlock.SourceHash = null;

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await BlockchainAPI.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet;
    } catch (error) {
      console.log("mintToken error", error);
      throw error;
    }
  }

  async serviceRequestAsync(
    arg: LyraContractABI
  ): Promise<AuthorizationAPIResult> {
    const tags: { [key: string]: string } = {
      [LyraGlobal.REQSERVICETAG]: arg.svcReq,
      objType: arg.objArgument.constructor.name,
      data: JSON.stringify(arg.objArgument)
    };

    const result = await this.sendEx(arg.targetAccountId, arg.amounts, tags);
    return result;
  }

  async createFiatWalletAsync(symbol: string): Promise<APIResult> {
    const existsWalletRet = await BlockchainAPI.findFiatWallet(
      this.accountId,
      symbol
    );
    if (existsWalletRet.data.resultCode != 0) {
      const crwlt: LyraContractABI = {
        svcReq: BrokerActions.BRK_FIAT_CRACT,
        targetAccountId: LyraGlobal.GUILDACCOUNTID,
        amounts: {
          [LyraGlobal.OFFICIALTICKERCODE]: 1
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

  async printFiat(symbol: string, count: number): Promise<APIResult> {
    const existsWalletRet = await BlockchainAPI.findFiatWallet(
      this.accountId,
      symbol
    );

    const printMoney: LyraContractABI = {
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

    const result2 = await this.serviceRequestAsync(printMoney);
    return result2;
  }

  async createUniOrder(order: UniOrder): Promise<AuthorizationAPIResult> {
    let tags: Tags = {
      [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_CRODR,
      data: stringify(order)
    };

    let amounts: Amounts = {};
    if (order.offering == LyraGlobal.OFFICIALTICKERCODE) {
      //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
      amounts = {
        [LyraGlobal.OFFICIALTICKERCODE]:
          order.amount + LyraGlobal.GetListingFeeFor() + order.cltamt
      };
    } else {
      //amounts.set(order.offering, order.amount);
      amounts = {
        [LyraGlobal.OFFICIALTICKERCODE]:
          LyraGlobal.GetListingFeeFor() + order.cltamt,
        [order.offering]: order.amount
      };
    }
    return await this.sendEx(order.daoId, amounts, tags);
  }

  async createUniTrade(trade: UniTrade): Promise<AuthorizationAPIResult> {
    let tags: Tags = {
      [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_CRTRD,
      data: stringify(trade)
    };

    let amounts: Amounts = {};
    if (trade.biding == LyraGlobal.OFFICIALTICKERCODE) {
      //amounts.set(order.offering, amounts.get(order.offering) + order.amount);
      amounts = {
        [LyraGlobal.OFFICIALTICKERCODE]: trade.pay + trade.cltamt
      };
    } else {
      //amounts.set(order.offering, order.amount);
      amounts = {
        [LyraGlobal.OFFICIALTICKERCODE]: trade.cltamt,
        [trade.biding]: trade.pay
      };
    }
    return await this.sendEx(trade.daoId, amounts, tags);
  }

  async DelistUniOrder(
    daoId: string,
    orderId: string
  ): Promise<AuthorizationAPIResult> {
    let tags: Tags = {
      [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_ORDDELST,
      daoid: daoId,
      orderid: orderId
    };

    let amounts: Amounts = {
      [LyraGlobal.OFFICIALTICKERCODE]: 1
    };

    return await this.sendEx(daoId, amounts, tags);
  }

  async CloseUniOrder(
    daoId: string,
    orderId: string
  ): Promise<AuthorizationAPIResult> {
    let tags: Tags = {
      [LyraGlobal.REQSERVICETAG]: BrokerActions.BRK_UNI_ORDCLOSE,
      daoid: daoId,
      orderid: orderId
    };

    let amounts: Amounts = {
      [LyraGlobal.OFFICIALTICKERCODE]: 1
    };

    return await this.sendEx(daoId, amounts, tags);
  }
}
