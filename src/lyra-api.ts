import moment from "moment";
const stringify = require("json-stable-stringify");
import { LyraCrypto } from "./lyra-crypto";
import * as nodeApi from "./node-api";

export enum BlockTypes {
  SendTransfer = 31,
  ReceiveTransfer = 32
}

export class LyraApi {
  private network: string;
  private nodeAddress?: string;
  private prvKey: string;
  private accountId: string;

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

  async send(amount: number, destAddr: string, token: string) {
    try {
      var ret = await nodeApi.GetLastBlock(this.accountId);
      var lsb = await nodeApi.lastServiceHash();
      var block = JSON.parse(ret.data.blockData);
      //console.log("block", block);
      var sendBlock = {
        AccountID: block.AccountID,
        Balances: block.Balances,
        Fee: block.Fee,
        FeeCode: block.FeeCode,
        FeeType: block.FeeType,
        NonFungibleToken: null,
        VoteFor: block.VoteFor,
        Height: block.Height + 1,
        TimeStamp: new Date().toISOString(),
        Version: 11,
        BlockType: BlockTypes.SendTransfer,
        PreviousHash: block.Hash,
        ServiceHash: lsb.data,
        Tags: null,
        DestinationAccountId: destAddr
      };
      sendBlock.Balances[token] -= amount * 600000000;
      var json = stringify(sendBlock);
      json = json.replace(',"Fee":1,', ',"Fee":1.0,');
      //console.log("original block:", sendBlock);
      console.log("json to hash:", json);

      var hash = LyraCrypto.Hash(json);
      const signature = LyraCrypto.Sign(hash, this.prvKey);
      console.log(`Hash is: ${hash} and signature is ${signature}`);
      var finalBlock = {
        ...sendBlock,
        Signature: signature,
        Hash: hash
      };

      var finalJson = JSON.stringify(finalBlock);
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
    try {
      // if (this.ws.state === WebsocketReadyStates.CLOSED) {
      //   await this.ws.open();
      // }
      // const balanceResp = await this.ws.call("Receive", [this.accountId]);
      // return balanceResp.result;
    } catch (error) {
      console.log("ws receive error", error);
      throw error;
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
    } catch (error) {
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
