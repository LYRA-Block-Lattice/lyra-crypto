import { Block } from "./block";
var JSONbig = require("json-bigint");

export interface Amounts {
  [key: string]: number;
}

export interface Tags {
  [key: string]: string;
}

export enum AccountTypes {
  Standard = 1,
  Savings = 2,
  Service = 3,
  PoolFactory = 5,
  Pool = 6,
  Staking = 7,
  Profiting = 8,
  DEX = 9,
  DAO = 10,
  OTC = 11,
  Voting = 12,
  Server = 13,
  Guild = 14,
  NFT = 30,
  Fiat = 31,
  TOT = 32
}

export enum AuthorizationFeeTypes {
  /// <summary>
  /// No authorization fee is included in the block.
  /// The fee is either not required for this block or paid by the second party.
  /// </summary>
  NoFee = 0,

  /// <summary>
  /// The regualr fee is included in the block.
  /// The second party ether does not exist, or both parties of the transaction pay an equal amount of fee set by the network.
  /// </summary>
  Regular = 1,

  /// <summary>
  /// Doubled fee is included in the block.
  /// The second party of the transaction won't need to pay any fee.
  /// </summary>
  BothParties = 2,

  /// <summary>
  /// dynamic calculated, like swap, with ratio, etc.
  /// </summary>
  Dynamic = 3,

  /// <summary>
  /// all funds are fees
  /// </summary>
  FullFee = 4
}

export enum NonFungibleTokenTypes {
  NotSet = 0,

  // LoyalShopper Shopify discount code
  LoyaltyDiscount = 1,

  // Lyra or Custom Collectible NFT
  Collectible = 2,

  // trade only token
  TradeOnly = 3

  // external NFT
  //ERC1155 = 3,
}

export enum BlockTypes {
  Null = 0,

  //NullTransaction = 1,

  // Network service blocks

  //ServiceGenesis = 10,

  Service = 11,

  Consolidation = 12,

  Sync = 13,

  // Opening blocks

  // This is the very first block that creates Lyra Gas token on primary shard
  LyraTokenGenesis = 20,

  // account opening block where the first transaction is receive transfer
  OpenAccountWithReceiveTransfer = 21,

  // the same as OpenWithReceiveTransfer Block but tells the authorizer that it received fee instead of regular transfer
  OpenAccountWithReceiveFee = 22,

  // Open a new account and import another account
  OpenAccountWithImport = 23,

  ReceiveAsFee = 24,

  // Transaction blocks

  TokenGenesis = 30,

  SendTransfer = 31,

  ReceiveTransfer = 32,

  // adds tarnsfers' fee to authorizer's account,
  // the fee is settled when a new sync or service block is generated, for the previous service Index,
  // by summarizing all the fee amounts from all blocks with the same corresponding sefrviceblock hash and dividing it by the number of authorizers in the sample,
  // the block can be validated by the next sample and all other nores in the same way,
  // fee data is not encrypted
  ReceiveFee = 33,

  // Imports an account into current account
  ImportAccount = 34,

  ReceiveMultipleFee = 35,

  ReceiveAuthorizerFee = 36,
  ReceiveNodeProfit = 37,

  // Trading blocks
  // Put Sell or Buy trade order to exchange tokens
  TradeOrder = 40,

  // Send tokens to the trade order to initiate trade
  Trade = 41,

  // Exchange tokens with Trade initiator to conclude the trade and execute the trade order
  ExecuteTradeOrder = 42,

  // Cancels the order and frees up the locked funds
  CancelTradeOrder = 43,

  // Liquidate Pool
  PoolFactory = 50,
  PoolGenesis = 51,
  PoolDeposit = 52,
  PoolWithdraw = 53,
  PoolSwapIn = 54,
  PoolSwapOut = 55,
  PoolRefundRecv,
  PoolRefundSend,

  // staking
  ProfitingGenesis = 60,
  Profiting = 61,
  Benefiting = 62,

  StakingGenesis = 65,
  Staking = 66,
  UnStaking = 67,

  // DEX
  DexWalletGenesis = 70,
  DexTokenMint = 71,
  DexTokenBurn = 72,
  DexSendToken = 73,
  DexRecvToken = 74,
  DexWithdrawToken = 75,

  // DAO
  OrgnizationRecv = 80,
  OrgnizationGenesis = 81,
  OrgnizationSend = 82,
  OrgnizationChange = 83,

  // OTC
  OTCOrderRecv = 84,
  OTCOrderGenesis = 85,
  OTCOrderSend = 86,
  OTCTradeRecv = 87,
  OTCTradeGenesis = 88,
  OTCTradeSend = 89,
  OTCTradeResolutionRecv = 90,

  // voting
  VoteGenesis = 100,
  Voting = 101,
  VotingRefund,

  // Dealer
  DealerRecv = 105,
  DealerSend = 106,
  DealerGenesis = 107,

  // Universal Order
  UniOrderRecv = 110,
  UniOrderGenesis = 111,
  UniOrderSend = 112,
  UniTradeRecv = 113,
  UniTradeGenesis = 114,
  UniTradeSend = 115,
  UniTradeResolutionRecv = 116,

  // NFT
  //NFTGenesis = 110,     // not needed. a normal genesis block can handle it.
  GuildRecv = 120,
  GuildSend = 121,
  GuildGenesis = 122,

  // Fiat
  FiatWalletGenesis = 130,
  FiatTokenPrint = 131,
  FiatTokenBurn = 132,
  FiatSendToken = 133,
  FiatRecvToken = 134
}

export enum ContractTypes {
  Default = 0,

  RewardPoint = 10,

  RedeemedDiscount = 20,

  GiftCard = 30,

  DiscountCoupon = 40,

  StoreCredit = 50,

  Cryptocurrency = 100,

  FiatCurrency = 200,

  Collectible = 300,

  TradeOnlyToken = 400,

  Custom = 1000
}

export enum HoldTypes {
  Token,
  NFT,
  Fiat,
  TOT,
  SVC
}

export function getHoldType(token: string): HoldTypes {
  const secs = token.split("/");
  switch (secs[0]) {
    case "tot":
      return HoldTypes.TOT;
    case "nft":
      return HoldTypes.NFT;
    case "svc":
      return HoldTypes.SVC;
    case "fiat":
      return HoldTypes.Fiat;
    default:
      return HoldTypes.Token;
  }
}

export enum APIResultCodes {
  Success = 0,
  UnknownError = 1,
  // default error code
  UndefinedError = 1000,
  BlockWithThisIndexAlreadyExists = 2,
  AccountAlreadyExists = 3,
  AccountDoesNotExist = 4,
  BlockWithThisPreviousHashAlreadyExists = 5, // double-spending attempt - trying to add another block to the same previous block
  BlockValidationFailed = 6,
  TokenGenesisBlockAlreadyExists = 7,
  CouldNotFindLatestBlock = 8,
  NegativeTransactionAmount = 9,
  AccountChainBlockValidationFailed = 10,
  AccountChainSignatureValidationFailed = 11,
  AccountChainBalanceValidationFailed = 12,
  AccountBlockAlreadyExists = 13,
  SourceSendBlockNotFound = 14,
  InvalidDestinationAccountId = 15,
  CouldNotTraceSendBlockChain = 16,
  TransactionAmountDoesNotMatch = 17,
  ExceptionInOpenAccountWithGenesis = 18,
  ExceptionInSendTransfer = 19,
  ExceptionInReceiveTransferAndOpenAccount = 20,
  ExceptionInReceiveTransfer = 21,
  InvalidBlockType = 22,
  ExceptionInCreateToken = 23,
  InvalidFeeAmount = 24,
  InvalidNewAccountBalance = 25,
  SendTransactionValidationFailed = 26,
  ReceiveTransactionValidationFailed = 27,
  TransactionTokenDoesNotMatch = 28,
  BlockSignatureValidationFailed = 29,
  NoNewTransferFound = 30,
  TokenGenesisBlockNotFound = 31,
  ServiceBlockNotFound = 32,
  BlockNotFound = 33,
  NoRPCServerConnection = 34,
  ExceptionInNodeAPI = 35,
  ExceptionInWebAPI = 36,
  PreviousBlockNotFound = 37,
  InsufficientFunds = 38,
  InvalidAccountId = 39,
  InvalidPrivateKey = 40,
  TradeOrderMatchFound = 41,
  InvalidIndexSequence = 42,
  FeatureIsNotSupported = 48,

  // Trade Codes

  ExceptionInTradeOrderAuthorizer = 43,
  ExceptionInTradeAuthorizer = 44,
  ExceptionInExecuteTradeOrderAuthorizer = 45,
  ExceptionInCancelTradeOrderAuthorizer = 46,

  TradeOrderValidationFailed = 47,
  NoTradesFound = 49,
  TradeOrderNotFound = 50,
  InvalidTradeAmount = 51,

  // Non-fungible token codes
  InvalidNonFungibleAmount = 52,
  InvalidNonFungibleTokenCode = 53,
  MissingNonFungibleToken = 54,
  InvalidNonFungibleSenderAccountId = 55,
  NoNonFungibleTokensFound = 56,
  OriginNonFungibleBlockNotFound = 57,
  SourceNonFungibleBlockNotFound = 58,
  OriginNonFungibleBlockHashDoesNotMatch = 59,
  SourceNonFungibleBlockHashDoesNotMatch = 60,
  NonFungibleSignatureVerificationFailed = 61,
  InvalidNonFungiblePublicKey = 62,

  InvalidNFT = 6200,
  InvalidCollectibleNFT = 6201,
  DuplicateNFTCollectibleSerialNumber = 6202,
  NFTCollectibleSerialNumberDoesNotExist = 6203,
  InvalidCollectibleNFTDenomination = 6204,
  InvalidCollectibleNFTSerialNumber = 6205,
  NFTInstanceNotFound = 6206,
  NFTSignaturesDontMatch = 6207,

  ТlockHashDoesNotMatch = 59,

  CancelTradeOrderValidationFailed = 63,

  InvalidFeeType = 64,

  InvalidParameterFormat = 65,

  APISignatureValidationFailed = 66,

  InvalidNetworkId = 67,
  CannotSendToSelf = 68,
  InvalidAmountToSend = 69,

  InvalidPreviousBlock,

  CannotModifyImportedAccount,
  AccountAlreadyImported,
  CannotImportEmptyAccount,
  CannotImportAccountWithOtherImports,
  ImportTransactionValidationFailed,
  CannotImportAccountToItself,

  // service blocks related
  InvalidConsolidationMerkleTreeHash = 80,
  InvalidConsolidationTotalFees,
  InvalidConsolidationMissingBlocks,
  InvalidServiceBlockTotalFees,
  InvalidFeeTicker,
  InvalidAuthorizerCount,
  InvalidAuthorizerInServiceBlock,
  InvalidLeaderInServiceBlock,
  InvalidLeaderInConsolidationBlock,
  InvalidConsolidationBlockContinuty,
  InvalidConsolidationBlockCount,
  InvalidConsolidationBlockHashes,

  InvalidSyncFeeBlock,

  DuplicateReceiveBlock = 100,

  InvalidTokenRenewalDate = 200,

  TokenExpired = 201,

  NameUnavailable = 202,
  DomainNameTooShort,
  EmptyDomainName,
  DomainNameReserved,

  NotAllowedToSign = 300,
  NotAllowedToCommit = 301,
  BlockFailedToBeAuthorized = 302,
  NodeOutOfSync = 303,
  PBFTNetworkNotReadyForConsensus = 304,
  DoubleSpentDetected = 305,
  NotListedAsQualifiedAuthorizer = 306,
  ConsensusTimeout = 307,
  SystemNotReadyToServe,
  InvalidBlockTimeStamp,

  FailedToSyncAccount,
  APIRouteFailed,
  InvalidDomainName,
  InvalidTickerName,
  InvalidAuthorizerSignatureInServiceBlock,

  InvalidTokenPair = 330,
  PoolAlreadyExists,
  PoolNotExists,
  PoolShareNotExists,
  InvalidPoolOperation,
  PoolOperationAlreadyCompleted,
  InvalidPoolDepositionAmount,
  InvalidPoolDepositionRito,
  InvalidPoolWithdrawAccountId,
  InvalidPoolWithdrawAmount,
  InvalidPoolWithdrawRito,
  InvalidTokenToSwap,
  TooManyTokensToSwap,
  InvalidPoolSwapOutToken,
  InvalidPoolSwapOutAmount,
  InvalidPoolSwapOutShare,
  InvalidPoolSwapOutAccountId,
  PoolSwapRitoChanged,
  InvalidSwapSlippage,
  SwapSlippageExcceeded,
  PoolOutOfLiquidaty,
  RequotaNeeded, // pool or target account is busy
  InvalidBlockTags,
  InvalidProfitingAccount,
  VotingDaysTooSmall,
  InvalidShareOfProfit,
  DuplicateName,
  InvalidStakingAccount,
  SystemBusy,
  InvalidName,
  InvalidRelatedTx,
  InvalidTimeRange,
  InvalidShareRitio,
  InvalidSeatsCount,
  InvalidMessengerAccount,
  RequestNotPermited,
  DuplicateAccountType,
  InvalidManagementBlock,
  InvalidBrokerAcount,
  InvalidUnstaking,
  InvalidBalance,
  InvalidOpeningAccount,
  InvalidBlockSequence,
  InvalidManagedTransaction,
  ProfitUnavaliable,
  BlockCompareFailed,
  InvalidAmount,

  InvalidBlockData = 400,
  AccountLockDown,
  UnsupportedBlockType,

  UnsuppportedServiceRequest = 500,
  InvalidServiceRequest = 501,
  Unsupported,

  InvalidExternalToken,
  InvalidTokenMint,
  InvalidTokenBurn,
  InvalidWithdrawToAddress,
  InvalidAccountType,
  UnsupportedDexToken,
  InvalidDexServer,
  InvalidExternalAddress,
  TokenNotFound,

  InvalidOrgnization,
  InvalidOrder,
  InvalidTrade,
  NotOwnerOfTrade,
  NotSellerOfTrade,
  InvalidTradeStatus,
  InvalidOrderStatus,
  InvalidCollateral,
  InputTooLong,
  Exception,
  StorageAPIFailure,

  DealerRoomNotExists,
  NotFound,
  InvalidTagParameters,
  InputTooShort,
  CollateralNotEnough,

  InvalidVote,
  InvalidArgument,
  Unauthorized,
  InvalidDAO,
  NotEnoughVoters,
  InvalidDataType,
  NotImplemented,
  InvalidOperation,
  AlreadyExecuted,
  InvalidToken,
  ResourceIsBusy,
  TradesPending,
  ArgumentOutOfRange,
  PriceChanged,
  InvalidDecimalDigitalCount,
  InvalidDealerServer,
  NotOwnerOfOrder,
  NotRegisteredToDealer,
  ResolutionPending,
  DisputeLevelWasRaised,
  PermissionDenied,
  DisputeCaseWasNotIncluded,
  InvalidVerificationCode,
  InvalidMetadataUri,
  APIIsObsolete,
  TotTransferNotAllowed,
  InvalidProofOfDelivery,
  InvalidFeeRito,
  InvalidPrice,
  DuplicateBlock
}

export enum ProfitingType {
  Node,
  Oracle,
  Merchant,
  Yield,
  Orgnization
}

export enum AccountChangeTypes {
  Genesis,
  SendToMe,
  ReceiveFromMe,
  MeSend,
  MeReceive,
  MyContract,
  OtherContract
}

export class APIResult {
  public resultCode!: APIResultCodes;
  public resultMessage!: string;
}
export class AuthorizationAPIResult extends APIResult {
  public txHash!: string;
}

export class BlockAPIResult extends APIResult {
  public blockData!: string;
  public resultBlockType!: BlockTypes;

  getBlock(): Block {
    return JSONbig.parse(this.blockData);
  }
}

export class MultiBlockAPIResult extends APIResult {
  public blockDatas!: string[];
  public resultBlockTypes!: BlockTypes[];

  getDaos(): Block[] {
    const blocks: Block[] = [];
    for (let i = 0; i < this.blockDatas.length; i++) {
      blocks.push(JSON.parse(this.blockDatas[i]));
    }
    return blocks;
  }
}

export class SimpleJsonAPIResult extends APIResult {
  public jsonString!: string;
  public getdata(): any {
    return JSON.parse(this.jsonString);
  }
}

export class BalanceChanges {
  changes?: { [key: string]: number };
  feeAmount?: number;
  feeCode?: string;
}

export class NewTransferAPIResult2 extends APIResult {
  public sourceHash!: string;
  public transfer!: BalanceChanges;
  public nonFungibleToken?: {};
}

export class ImageUploadResult extends APIResult {
  hash!: string;
  url!: string;
}

export class LyraContractABI {
  svcReq!: string;
  targetAccountId!: string;
  amounts!: { [key: string]: number };
  objArgument: any;
}

export class BrokerActions {
  public static readonly BRK_POOL_CRPL = "CRPL";
  public static readonly BRK_POOL_ADDLQ = "ADDLQ";
  public static readonly BRK_POOL_RMLQ = "RMLQ";
  public static readonly BRK_POOL_SWAP = "SWAP";

  public static readonly BRK_STK_CRSTK = "CRSTK";
  public static readonly BRK_STK_ADDSTK = "ADDSTK";
  public static readonly BRK_STK_UNSTK = "UNSTK";

  public static readonly BRK_PFT_CRPFT = "CRPFT";
  //public static readonly BRK_PFT_FEEPFT = "FEEPFT";    // combine to getpft
  public static readonly BRK_PFT_GETPFT = "GETPFT";

  //public static readonly BRK_MCT_CRMCT = "CRMCT";
  //public static readonly BRK_MCT_PAYMCT = "PAYMCT";
  //public static readonly BRK_MCT_UNPAY = "UNPAY";
  //public static readonly BRK_MCT_CFPAY = "CFPAY";
  //public static readonly BRK_MCT_GETPAY = "GETPAY";

  // DEX
  public static readonly BRK_DEX_DPOREQ = "DPOREQ";
  public static readonly BRK_DEX_MINT = "MINT";
  public static readonly BRK_DEX_GETTKN = "GETTKN";
  public static readonly BRK_DEX_PUTTKN = "PUTTKN";
  public static readonly BRK_DEX_WDWREQ = "WDWREQ";

  // Fiat
  public static readonly BRK_FIAT_CRACT = "FATCRACT";
  public static readonly BRK_FIAT_PRINT = "FATPRNT";
  public static readonly BRK_FIAT_GET = "FATGET";

  // DAO
  public static readonly BRK_DAO_CRDAO = "CRDAO";
  public static readonly BRK_DAO_JOIN = "JOINDAO";
  public static readonly BRK_DAO_LEAVE = "LEAVEDAO";
  public static readonly BRK_DAO_CHANGE = "CHANGEDAO";
  public static readonly BRK_DAO_VOTED_CHANGE = "VTCHGDAO";

  // OTC
  public static readonly BRK_OTC_CRODR = "CRODR";
  public static readonly BRK_OTC_CRTRD = "CRTRD";
  public static readonly BRK_OTC_TRDPAYSENT = "TRDPAYSNT";
  public static readonly BRK_OTC_TRDPAYGOT = "TRDPAYGOT";
  public static readonly BRK_OTC_ORDDELST = "ORDDELST";
  public static readonly BRK_OTC_ORDCLOSE = "ORDCLOSE";
  public static readonly BRK_OTC_TRDCANCEL = "TRDCANCEL";

  // OTC Dispute
  public static readonly BRK_OTC_CRDPT = "ORDCRDPT";
  public static readonly BRK_OTC_RSLDPT = "ORDRSLDPT";

  // Voting
  public static readonly BRK_VOT_CREATE = "CRVOTS";
  public static readonly BRK_VOT_VOTE = "VOTE";
  public static readonly BRK_VOT_CLOSE = "VOTCLS";

  // Dealer
  public static readonly BRK_DLR_CREATE = "DLRCRT";
  public static readonly BRK_DLR_UPDATE = "DLRUPD";

  // Universal Order/Trade
  public static readonly BRK_UNI_CRODR = "UCRODR";
  public static readonly BRK_UNI_CRTRD = "UCRTRD";
  public static readonly BRK_UNI_TRDPAYSENT = "UTRDPAYSNT";
  public static readonly BRK_UNI_TRDPAYGOT = "UTRDPAYGOT";
  public static readonly BRK_UNI_ORDDELST = "UORDDELST";
  public static readonly BRK_UNI_ORDCLOSE = "UORDCLOSE";
  public static readonly BRK_UNI_TRDCANCEL = "UTRDCANCEL";

  // Universal Dispute
  public static readonly BRK_UNI_CRDPT = "UORDCRDPT";
  public static readonly BRK_UNI_RSLDPT = "UORDRSLDPT";
}

export enum UniOrderStatus {
  Open, // just add, trade begin
  Partial = 10, // partial traded, total count reduced
  Closed = 30, // close order and all pending trading, get back collateral
  Delist = 50 // prevent order from trading, but wait for all trading finished. after which order can be closed.
}

export enum UniTradeStatus {
  // start
  Open,

  // trade begins
  Processing,
  //Arrived,
  //BidSent = 10,
  //BidReceived,
  //OfferSent,
  //OfferReceived,

  //// sku to sku
  //BothShipping,
  //BothConfirmed,

  // special trade has special state, add bellow.

  // trade ends successfull
  Closed = 30,

  // trade in abnormal states
  Dispute = 40,
  DisputeClosed = 45,

  // canceled trade. not count.
  Canceled = 50
}

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: NftAttribute[];
}

export interface NftAttribute {
  trait_type: string;
  value: string;
}
