import { LyraApi } from "../lyra-api";
import { LyraCrypto } from "../lyra-crypto";
import {
  AccountTypes,
  AuthorizationFeeTypes,
  BlockTypes,
  ContractTypes,
  NonFungibleTokenTypes,
  HoldTypes
} from "./meta";
import stringify from "json-stable-stringify";

export class LyraGlobal {
  static readonly DatabaseVersion = 11;
  static readonly BALANCERATIO = 100000000;
  static readonly REQSERVICETAG = "svcreq";
  static readonly MANAGEDTAG = "managed";
  static readonly OFFICIALTICKERCODE = "LYR";
  static readonly GUILDACCOUNTID =
    "L8cqJqYPyx9NjiRYf8KyCjBaCmqdgvZJtEkZ7M9Hf7LnzQU3DamcurxeDEkws9HXPjLaGi9CVgcRwdCp377xLEB1qcX15";

  static GetListingFeeFor = () => 10;
}

export class Block {
  Height: number;
  TimeStamp: string;
  Version: number;
  BlockType: BlockTypes;
  PreviousHash: string | null;
  ServiceHash: string;
  Tags: any;

  constructor(blockData: string | undefined) {
    this.TimeStamp = new Date().toISOString();
    this.Version = LyraGlobal.DatabaseVersion;
    this.BlockType = this.GetBlockType();
    this.PreviousHash = null;
    this.Tags = null;
    if (blockData === undefined) {
      this.Height = 1;
    } else {
      const decodedBlockData = JSON.parse(blockData);
      this.Height = decodedBlockData.Height + 1;
      this.PreviousHash = decodedBlockData.Hash;
    }
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.Null;
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    // setup service block related fields
    this.ServiceHash = sb.Hash;

    var json = stringify(this);
    // hack: to compatible with Newtonsoft.Json
    //json = json.replace(',"Fee":1,', ',"Fee":1.0,');
    //console.log("original block:", sendBlock);
    console.log("json to hash:", json);

    var hash = LyraCrypto.Hash(json);
    const signature = wallet.sign(hash);
    //console.log(`Hash is: ${hash} and signature is ${signature}`);
    var finalBlock = {
      ...this,
      Signature: signature,
      Hash: hash
    };
    var finalJson = JSON.stringify(finalBlock);
    return finalJson;
  }
}

export class SignedBlock extends Block {
  Hash: string;
  Signature: string;
  constructor(blockData: string | undefined) {
    super(blockData);
    if (blockData === undefined) {
      throw new Error("blockData is undefined. should not happen.");
    } else {
      const decodedBlockData = JSON.parse(blockData);
      this.Hash = decodedBlockData.Hash;
      this.Signature = decodedBlockData.Signature;
    }
  }
}

export class CurrentServiceBlock extends SignedBlock {
  Leader: string;
  Authorizers: { [key: string]: string };
  NetworkId: string;
  FeeTicker: string;
  TransferFee: number;
  TokenGenerationFee: number;
  TradeFee: number;
  FeesGenerated: number;
  constructor(blockData: string | undefined) {
    super(blockData);
    if (blockData === undefined) {
      throw new Error("blockData is undefined. should not happen.");
    } else {
      const decodedBlockData = JSON.parse(blockData);
      this.Leader = decodedBlockData.Leader;
      this.Authorizers = decodedBlockData.Authorizers;
      this.NetworkId = decodedBlockData.NetworkId;
      this.FeeTicker = decodedBlockData.FeeTicker;
      this.TransferFee = decodedBlockData.TransferFee;
      this.TokenGenerationFee = decodedBlockData.TokenGenerationFee;
      this.TradeFee = decodedBlockData.TradeFee;
      this.FeesGenerated = decodedBlockData.FeesGenerated;
    }
  }
}

export class TransactionBlock extends Block {
  AccountID: string;
  Balances: {
    [key: string]: number;
  };
  Fee: number;
  FeeCode: string;
  FeeType: AuthorizationFeeTypes;
  NonFungibleToken: any;
  VoteFor: any;

  constructor(blockData: string | undefined) {
    super(blockData);
    this.NonFungibleToken = null;
    if (blockData === undefined) {
      this.Balances = {};

      this.VoteFor = null;
    } else {
      const decodedBlockData = JSON.parse(blockData);
      this.AccountID = decodedBlockData.AccountID;
      this.Balances = decodedBlockData.Balances;

      this.VoteFor = decodedBlockData.VoteFor;
    }
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    this.AccountID = wallet.accountId;
    // setup service block related fields
    this.FeeCode = sb.FeeTicker;
    return super.toJson(wallet, sb);
  }
}

export class SendTransferBlock extends TransactionBlock {
  DestinationAccountId: string;

  constructor(blockData: string | undefined) {
    super(blockData);
    if (blockData === undefined) {
    } else {
      const decodedBlockData = JSON.parse(blockData);
      this.DestinationAccountId = decodedBlockData.DestinationAccountId;
    }
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.SendTransfer;
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    // setup service block related fields
    this.Fee = sb.TransferFee;
    this.FeeType = AuthorizationFeeTypes.Regular;
    this.Balances[sb.FeeTicker] -= sb.TransferFee * LyraGlobal.BALANCERATIO;
    return super.toJson(wallet, sb);
  }
}

export class ReceiveTransferBlock extends TransactionBlock {
  SourceHash: string | null;

  constructor(blockData: string | undefined) {
    super(blockData);
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.ReceiveTransfer;
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    // setup service block related fields
    if (this.BlockType == BlockTypes.ReceiveTransfer) {
      this.Fee = 0;
      this.FeeType = AuthorizationFeeTypes.NoFee;
    }
    return super.toJson(wallet, sb);
  }
}

export class OpenWithReceiveTransferBlock extends ReceiveTransferBlock {
  AccountType: AccountTypes;

  constructor(blockData: string | undefined) {
    super(blockData);
    if (blockData === undefined) {
      this.AccountType = AccountTypes.Standard;
    } else {
      throw new Error("Should not be called with blockData");
    }
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.OpenAccountWithReceiveTransfer;
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    // setup service block related fields
    this.Fee = 0;
    this.FeeType = AuthorizationFeeTypes.NoFee;
    return super.toJson(wallet, sb);
  }
}

export class TokenGenesisBlock extends ReceiveTransferBlock {
  Ticker: string;
  DomainName: string;
  ContractType: ContractTypes;
  RenewalDate: Date;
  Edition: number;
  Description: string;
  Precision: number;
  IsFinalSupply: boolean;
  IsNonFungible: boolean;
  NonFungibleType: NonFungibleTokenTypes;
  NonFungibleKey: string;
  Owner: string | null;
  Address: string | null;
  Currency: string | null;
  Icon: string | null;
  Image: string | null;
  Custom1: string | null;
  Custom2: string | null;
  Custom3: string | null;

  constructor(blockData: string | undefined) {
    super(blockData);
    if (blockData === undefined) {
      throw new Error("Should not be called with blockData");
    } else {
      this.IsNonFungible = false;
    }
  }

  GetBlockType(): BlockTypes {
    return BlockTypes.TokenGenesis;
  }

  toJson(wallet: LyraApi, sb: CurrentServiceBlock): string {
    // setup service block related fields
    //console.log("sb: ", sb);
    this.Fee = sb.TokenGenerationFee;
    this.FeeType = AuthorizationFeeTypes.Regular;
    this.Balances[sb.FeeTicker] -=
      sb.TokenGenerationFee * LyraGlobal.BALANCERATIO;
    return super.toJson(wallet, sb);
  }
}

export class UniOrder {
  daoId!: string;
  dealerId!: string;
  offerby!: HoldTypes;
  offering!: string;
  bidby!: HoldTypes;
  biding!: string;
  price!: number;
  eqprice!: number;
  amount!: number;
  limitMin!: number;
  limitMax!: number;
  payBy!: string[];
  cltamt!: number;
}

export class UniTrade {
  public daoId: string;
  public dealerId: string;
  public orderId: string;
  public orderOwnerId: string;

  public offby: HoldTypes;
  public offering: string;

  public bidby: HoldTypes;
  public biding: string;

  public price: number;
  public eqprice: number;

  public amount: number;
  public cltamt: number;

  public pay: number;
  public payVia: string;

  constructor(
    daoId: string,
    dealerId: string,
    orderId: string,
    orderOwnerId: string,
    offby: HoldTypes,
    offering: string,
    bidby: HoldTypes,
    biding: string,
    price: number,
    eqprice: number,
    amount: number,
    cltamt: number,
    pay: number,
    payVia: string
  ) {
    this.daoId = daoId;
    this.dealerId = dealerId;
    this.orderId = orderId;
    this.orderOwnerId = orderOwnerId;
    this.offby = offby;
    this.offering = offering;
    this.bidby = bidby;
    this.biding = biding;
    this.price = price;
    this.eqprice = eqprice;
    this.amount = amount;
    this.cltamt = cltamt;
    this.pay = pay;
    this.payVia = payVia;
  }
}
