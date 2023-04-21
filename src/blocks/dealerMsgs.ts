import { LyraApi } from "../lyra-api";
import { LyraCrypto } from "../lyra-crypto";
import { APIResult } from "./meta";

const stringify = require("../../my-json-stringify");
var JSONbig = require("json-bigint");

export class DealMessage {
  PrevHash: string;
  TimeStamp: string;
  TradeId: string;
  AccountId: string;

  constructor(messageData: string | undefined) {
    if (messageData === undefined) {
      this.TimeStamp = new Date().toISOString();
      this.PrevHash = "";
      this.TradeId = "";
      this.AccountId = "";
    } else {
      const decodedBlockData = JSON.parse(messageData);
      this.TimeStamp = decodedBlockData.TimeStamp;
      this.PrevHash = decodedBlockData.PrevHash;
      this.TradeId = decodedBlockData.TradeId;
      this.AccountId = decodedBlockData.AccountId;
    }
  }

  toSigned(wallet: LyraApi): {} {
    var json = stringify(this);
    console.log("json to hash:", json);

    var hash = LyraCrypto.Hash(json);
    const signature = wallet.sign(hash);
    //console.log(`Hash is: ${hash} and signature is ${signature}`);
    var finalBlock = {
      ...this,
      Signature: signature,
      Hash: hash
    };
    return finalBlock;
  }
}

export class SignedMessage extends DealMessage {
  Hash: string;
  Signature: string;
  constructor(messageData: string | undefined) {
    super(messageData);
    if (messageData === undefined) {
      throw new Error("messageData is undefined. should not happen.");
    } else {
      const decodedBlockData = JSON.parse(messageData);
      this.Hash = decodedBlockData.Hash;
      this.Signature = decodedBlockData.Signature;
    }
  }
}

export class DealChatMessage extends DealMessage {
  Text: string;

  constructor(messageData: string | undefined) {
    super(messageData);
    if (messageData === undefined) {
      this.Text = "";
    } else {
      const decodedBlockData = JSON.parse(messageData);
      this.Text = decodedBlockData.Text;
    }
  }
}

export enum PinnedMode {
  Notify,
  Wait,
  Action
}
export enum DisputeLevels {
  None,
  Peer,
  DAO,
  LyraCouncil
}

export class PinnedMessage {
  mode!: PinnedMode;
  tradeId!: string;
  text!: string;
  level!: DisputeLevels;
}

export class ChatMessages {
  DealerId!: string;
  Pinned!: PinnedMessage;
  History!: DealMessage[];
  Roles!: StringDictionary;
}
export interface ChatDictionary {
  [key: string]: ChatMessages;
}

interface StringDictionary {
  [key: string]: string;
}
export class JoinRoomResult extends APIResult {
  history!: ChatMessages;
  roles!: StringDictionary;
}
