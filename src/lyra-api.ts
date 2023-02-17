import { LyraCrypto } from "./lyra-crypto";

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
      // if (this.ws.state === WebsocketReadyStates.CLOSED) {
      //   await this.ws.open();
      // }
      // const balanceResp = await this.ws.call("Send", [
      //   this.accountId,
      //   amount,
      //   destAddr,
      //   token
      // ]);
      // return balanceResp.result;
    } catch (error) {
      console.log("ws send error", error);
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
    // if (this.ws.state === WebsocketReadyStates.CLOSED) {
    //   await this.ws.open();
    // }
    // const balanceResp = await this.ws.call("Balance", [this.accountId]);
    // return balanceResp.result;
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
