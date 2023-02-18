import { AxiosError } from "axios";
import moment from "moment";
import {
  LyraGlobal,
  OpenWithReceiveTransferBlock,
  ReceiveTransferBlock,
  SendTransferBlock,
  TokenGenesisBlock
} from "./blocks/block";
import { ContractTypes } from "./blocks/meta";

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
      console.log("sendBlock", finalJson);

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
        console.log("changes", unrecv.data);

        if (unrecv.data.resultCode == 0) {
          // success.
          var lsb = await nodeApi.getLastServiceBlock();
          var sb = JSON.parse(lsb.data.blockData);

          var ret = await nodeApi.GetLastBlock(this.accountId);
          console.log("last block", ret.data);
          var receiveBlock =
            ret.data.resultCode == 0
              ? new ReceiveTransferBlock(ret.data.blockData)
              : new OpenWithReceiveTransferBlock(undefined);

          receiveBlock.SourceHash = unrecv.data.sourceHash;

          const changesArray: [string, number][] = Object.entries(
            unrecv.data.transfer.changes
          );
          console.log("changesArray", changesArray);
          changesArray.forEach(([key, value]) => {
            if (key != undefined) {
              if (receiveBlock.Balances.hasOwnProperty(key))
                receiveBlock.Balances[key] += value * 100000000;
              else receiveBlock.Balances[key] = value * 100000000;
            }
          });

          const finalJson = receiveBlock.toJson(this, sb);
          const recvret = await nodeApi.recvTransfer(finalJson);

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

  async history(startTimeUtc: Date, endTimeUtc: Date, count: number) {
    try {
      // // json time. convert it to dotnet time
      // const dtStart = new Date(
      //   new Date(1970, 0, 1, 0, 0, 0, 0).getTime() + startTime * 10000
      // );
      // const dtEnd = new Date(
      //   new Date(1970, 0, 1, 0, 0, 0, 0).getTime() + endTime * 10000
      // );
      // const hists = await _node.SearchTransactionsAsync(
      //   accountId,
      //   dtStart.getTime(),
      //   dtEnd.getTime(),
      //   count
      // );
      // if (hists.Successful())
      //   return hists.Transactions.map((x) => new TxDesc(x));
      // else throw new Error(`${hists.ResultCode}: ${hists.ResultMessage}`);
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
    owner: string, // shop name
    address: string, // shop URL
    currency: string, // USD
    contractType: ContractTypes, // reward or discount or custom
    tags: Record<string, string>
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
}
