export class Block {
  Height: number;
  TimeStamp: Date;
  Version: number;
  BlockType: number;
  PreviousHash: string;
  ServiceHash: string;
  Tags: any;
  Hash: string;
  Signature: string;

  constructor(blockData: string) {
    const decodedBlockData = JSON.parse(JSON.parse(blockData));
    this.Height = decodedBlockData.Height;
    this.TimeStamp = new Date(decodedBlockData.TimeStamp);
    this.Version = decodedBlockData.Version;
    this.BlockType = decodedBlockData.BlockType;
    this.PreviousHash = decodedBlockData.PreviousHash;
    this.ServiceHash = decodedBlockData.ServiceHash;
    this.Tags = decodedBlockData.Tags;
    this.Hash = decodedBlockData.Hash;
    this.Signature = decodedBlockData.Signature;
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
    const decodedBlockData = JSON.parse(JSON.parse(blockData));
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
    const decodedBlockData = JSON.parse(JSON.parse(blockData));
    this.DestinationAccountId = decodedBlockData.DestinationAccountId;
  }
}

export class ReceiveTransferBlock extends TransactionBlock {
  SourceHash: string;

  constructor(blockData: string) {
    super(blockData);
    const decodedBlockData = JSON.parse(JSON.parse(blockData));
    this.SourceHash = decodedBlockData.SourceHash;
  }
}
