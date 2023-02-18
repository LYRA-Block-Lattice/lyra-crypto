import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  LyraGlobal,
  OpenWithReceiveTransferBlock,
  ReceiveTransferBlock,
  SendTransferBlock,
  TokenGenesisBlock
} from "./blocks/block";
import {
  AuthorizationAPIResult,
  ContractTypes,
  HoldTypes,
  NonFungibleTokenTypes
} from "./blocks/meta";

import { LyraCrypto } from "./lyra-crypto";
import * as nodeApi from "./node-api";

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

  async send(amount: number, destAddr: string, token: string) {
    try {
      var ret = await nodeApi.GetLastBlock(this.accountId);
      var lsb = await nodeApi.getLastServiceBlock();
      var sb = JSON.parse(lsb.data.blockData);

      var sendBlock = new SendTransferBlock(ret.data.blockData);
      console.log(
        `Current balance is: ${
          sendBlock.Balances[token] / LyraGlobal.BALANCERATIO
        }`
      );
      sendBlock.Balances[token] -= amount * LyraGlobal.BALANCERATIO;
      sendBlock.DestinationAccountId = destAddr;

      const finalJson = sendBlock.toJson(this, sb);
      //console.log("sendBlock", finalJson);

      var sendRet = await nodeApi.sendTransfer(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet.data;
    } catch (error) {
      console.log("send error", error);
      throw error;
    }
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
          var receiveBlock =
            ret.data.resultCode == 0
              ? new ReceiveTransferBlock(ret.data.blockData)
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
            ret.data.resultCode == 0
              ? await nodeApi.recvTransfer(finalJson)
              : await nodeApi.recvTransferWithOpenAccount(finalJson);

          if (recvret.data.resultCode == 0) {
            // continue to receive next block.
          } else {
            return recvret.data;
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
      var ret = await nodeApi.getBalance(this.accountId);

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
      const hists = await nodeApi.getHistory(this.accountId, start, end, count);
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
      var ret = await nodeApi.GetLastBlock(this.accountId);
      var lsb = await nodeApi.getLastServiceBlock();
      var sb = JSON.parse(lsb.data.blockData);

      const ticker = domainName + "/" + tokenName;
      var gensBlock = new TokenGenesisBlock(ret.data.blockData);

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

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await nodeApi.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet.data;
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
      var ret = await nodeApi.GetLastBlock(this.accountId);
      var lsb = await nodeApi.getLastServiceBlock();
      var sb = JSON.parse(lsb.data.blockData);

      const domainName = "nft";
      const ticker = domainName + "/" + uuidv4();
      var gensBlock = new TokenGenesisBlock(ret.data.blockData);

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

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await nodeApi.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet.data;
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
      var ret = await nodeApi.GetLastBlock(this.accountId);
      var lsb = await nodeApi.getLastServiceBlock();
      var sb = JSON.parse(lsb.data.blockData);

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
      var gensBlock = new TokenGenesisBlock(ret.data.blockData);

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

      gensBlock.Balances[ticker] = supply * LyraGlobal.BALANCERATIO;

      const finalJson = gensBlock.toJson(this, sb);
      console.log("sendBlock", finalJson);

      var sendRet = await nodeApi.mintToken(finalJson);
      //console.log("sendRet", sendRet);
      return sendRet.data;
    } catch (error) {
      console.log("mintToken error", error);
      throw error;
    }
  }
}
