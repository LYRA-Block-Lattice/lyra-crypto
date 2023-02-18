import { LyraApi } from "../lyra-api";
import { LyraCrypto } from "../lyra-crypto";
import { AccountTypes, BlockTypes } from "./meta";
const stringify = require("json-stable-stringify");

export class LyraGlobal {
  static readonly DatabaseVersion = 11;
}
export class Block {
  Height: number;
  TimeStamp: string;
  Version: number;
  BlockType: BlockTypes;
  PreviousHash: string;
  ServiceHash: string;
  Tags: any;

  constructor(blockData: string) {
    const decodedBlockData = JSON.parse(blockData);
    this.Height = decodedBlockData.Height + 1;
    this.TimeStamp = new Date().toISOString();
    this.Version = LyraGlobal.DatabaseVersion;
    this.BlockType = this.GetBlockType();
    this.PreviousHash = decodedBlockData.Hash;

    this.Tags = null;
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.Null;
  }

  toJson(wallet: LyraApi): string {
    var json = stringify(this);
    // hack: to compatible with Newtonsoft.Json
    //json = json.replace(',"Fee":1,', ',"Fee":1.0,');
    //console.log("original block:", sendBlock);
    console.log("json to hash:", json);

    var hash = LyraCrypto.Hash(json);
    const signature = wallet.sign(hash);
    console.log(`Hash is: ${hash} and signature is ${signature}`);
    var finalBlock = {
      ...this,
      Signature: signature,
      Hash: hash
    };
    var finalJson = JSON.stringify(finalBlock);
    return finalJson;
  }
}

export class TransactionBlock extends Block {
  AccountID: string;
  Balances: {
    [key: string]: number;
  };
  Fee: number;
  FeeCode: string;
  FeeType: number;
  NonFungibleToken: any;
  VoteFor: any;

  constructor(blockData: string) {
    super(blockData);
    const decodedBlockData = JSON.parse(blockData);
    this.AccountID = decodedBlockData.AccountID;
    this.Balances = decodedBlockData.Balances;
    this.Fee = decodedBlockData.Fee;
    this.FeeCode = decodedBlockData.FeeCode;
    this.FeeType = decodedBlockData.FeeType;
    this.NonFungibleToken = decodedBlockData.NonFungibleToken;
    this.VoteFor = decodedBlockData.VoteFor;
  }
}

export class SendTransferBlock extends TransactionBlock {
  DestinationAccountId: string;

  constructor(blockData: string) {
    super(blockData);
    const decodedBlockData = JSON.parse(blockData);
    this.DestinationAccountId = decodedBlockData.DestinationAccountId;
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.SendTransfer;
  }
}

export class ReceiveTransferBlock extends TransactionBlock {
  SourceHash: string;

  constructor(blockData: string) {
    super(blockData);
    const decodedBlockData = JSON.parse(blockData);
    this.SourceHash = decodedBlockData.SourceHash;
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.ReceiveTransfer;
  }
}

export class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
  AccountType: AccountTypes;

  constructor(blockData: string) {
    super(blockData);
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.OpenAccountWithReceiveTransfer;
  }
}
