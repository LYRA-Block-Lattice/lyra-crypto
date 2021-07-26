import { create } from "istanbul-reports";
import {
  JsonRpcWebsocket,
  WebsocketReadyStates
} from "jsonrpc-client-websocket";

import { LyraCrypto } from "./lyra-crypto";

export class LyraApi {
  private network: string;
  private nodeAddress?: string;
  private prvKey: string;
  private accountId: string;
  private ws: JsonRpcWebsocket;

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

  async init() {
    await this.createWS();
  }

  private async createWS() {
    var url = "wss://testnet.lyra.live/api/v1/socket";
    if (this.nodeAddress === undefined) {
      if (this.network === "mainnet") {
        url = "wss://mainnet.lyra.live/api/v1/socket";
      }

      if (this.network === "devnet") url = "wss://localhost:4504/api/v1/socket";
    } else {
      url = `wss://${this.nodeAddress}/api/v1/socket`;
    }

    console.log(`creating ws for ${this.network} using ${url}`);

    const requestTimeoutMs = 10000;

    this.ws = new JsonRpcWebsocket(url, requestTimeoutMs, (error) => {
      console.log("websocket error", error);
      throw error;
    });

    try {
      await this.ws.open();
    } catch (error) {
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
        var signt = LyraCrypto.Sign(msg, this.prvKey);
        console.log("Signature", signt);

        return ["der", signt];
      } catch (err) {
        console.log("Error sign message", err);
        return ["err", err.toString()];
      }
    });

    try {
      const response = await this.ws.call("Status", ["2.2.0.0", this.network]);
      await this.ws.call("Monitor", [this.accountId]);
    } catch (error) {
      console.log("ws init error", error);
    }
  }

  async send(destAddr: string, amount: number, token: string) {
    try {
      if (this.ws.state === WebsocketReadyStates.CLOSED) {
        await this.ws.open();
      }
      const balanceResp = await this.ws.call("Send", [
        this.accountId,
        amount,
        destAddr,
        token
      ]);
      return balanceResp.result;
    } catch (error) {
      console.log("ws send error", error);
      throw error;
    }
  }

  async receive() {
    try {
      if (this.ws.state === WebsocketReadyStates.CLOSED) {
        await this.ws.open();
      }
      const balanceResp = await this.ws.call("Receive", [this.accountId]);
      return balanceResp.result;
    } catch (error) {
      console.log("ws receive error", error);
      throw error;
    }
  }

  async balance() {
    if (this.ws.state === WebsocketReadyStates.CLOSED) {
      await this.ws.open();
    }

    const balanceResp = await this.ws.call("Balance", [this.accountId]);
    return balanceResp.result;
  }

  close() {
    console.log("closing lyra-api");
    this.ws.close();
    this.accountId = "";
    this.prvKey = "";
  }
}
