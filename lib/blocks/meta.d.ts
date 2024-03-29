import { Block } from "./block";
export interface Amounts {
    [key: string]: number;
}
export interface Tags {
    [key: string]: string;
}
export declare enum AccountTypes {
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
export declare enum AuthorizationFeeTypes {
    NoFee = 0,
    Regular = 1,
    BothParties = 2,
    Dynamic = 3,
    FullFee = 4
}
export declare enum NonFungibleTokenTypes {
    NotSet = 0,
    LoyaltyDiscount = 1,
    Collectible = 2,
    TradeOnly = 3
}
export declare enum BlockTypes {
    Null = 0,
    Service = 11,
    Consolidation = 12,
    Sync = 13,
    LyraTokenGenesis = 20,
    OpenAccountWithReceiveTransfer = 21,
    OpenAccountWithReceiveFee = 22,
    OpenAccountWithImport = 23,
    ReceiveAsFee = 24,
    TokenGenesis = 30,
    SendTransfer = 31,
    ReceiveTransfer = 32,
    ReceiveFee = 33,
    ImportAccount = 34,
    ReceiveMultipleFee = 35,
    ReceiveAuthorizerFee = 36,
    ReceiveNodeProfit = 37,
    TradeOrder = 40,
    Trade = 41,
    ExecuteTradeOrder = 42,
    CancelTradeOrder = 43,
    PoolFactory = 50,
    PoolGenesis = 51,
    PoolDeposit = 52,
    PoolWithdraw = 53,
    PoolSwapIn = 54,
    PoolSwapOut = 55,
    PoolRefundRecv = 56,
    PoolRefundSend = 57,
    ProfitingGenesis = 60,
    Profiting = 61,
    Benefiting = 62,
    StakingGenesis = 65,
    Staking = 66,
    UnStaking = 67,
    DexWalletGenesis = 70,
    DexTokenMint = 71,
    DexTokenBurn = 72,
    DexSendToken = 73,
    DexRecvToken = 74,
    DexWithdrawToken = 75,
    OrgnizationRecv = 80,
    OrgnizationGenesis = 81,
    OrgnizationSend = 82,
    OrgnizationChange = 83,
    OTCOrderRecv = 84,
    OTCOrderGenesis = 85,
    OTCOrderSend = 86,
    OTCTradeRecv = 87,
    OTCTradeGenesis = 88,
    OTCTradeSend = 89,
    OTCTradeResolutionRecv = 90,
    VoteGenesis = 100,
    Voting = 101,
    VotingRefund = 102,
    DealerRecv = 105,
    DealerSend = 106,
    DealerGenesis = 107,
    UniOrderRecv = 110,
    UniOrderGenesis = 111,
    UniOrderSend = 112,
    UniTradeRecv = 113,
    UniTradeGenesis = 114,
    UniTradeSend = 115,
    UniTradeResolutionRecv = 116,
    GuildRecv = 120,
    GuildSend = 121,
    GuildGenesis = 122,
    FiatWalletGenesis = 130,
    FiatTokenPrint = 131,
    FiatTokenBurn = 132,
    FiatSendToken = 133,
    FiatRecvToken = 134
}
export declare enum ContractTypes {
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
export declare enum HoldTypes {
    Token = 0,
    NFT = 1,
    Fiat = 2,
    TOT = 3,
    SVC = 4
}
export declare function getHoldType(token: string): HoldTypes;
export declare enum APIResultCodes {
    Success = 0,
    UnknownError = 1,
    UndefinedError = 1000,
    BlockWithThisIndexAlreadyExists = 2,
    AccountAlreadyExists = 3,
    AccountDoesNotExist = 4,
    BlockWithThisPreviousHashAlreadyExists = 5,
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
    ExceptionInTradeOrderAuthorizer = 43,
    ExceptionInTradeAuthorizer = 44,
    ExceptionInExecuteTradeOrderAuthorizer = 45,
    ExceptionInCancelTradeOrderAuthorizer = 46,
    TradeOrderValidationFailed = 47,
    NoTradesFound = 49,
    TradeOrderNotFound = 50,
    InvalidTradeAmount = 51,
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
    InvalidPreviousBlock = 70,
    CannotModifyImportedAccount = 71,
    AccountAlreadyImported = 72,
    CannotImportEmptyAccount = 73,
    CannotImportAccountWithOtherImports = 74,
    ImportTransactionValidationFailed = 75,
    CannotImportAccountToItself = 76,
    InvalidConsolidationMerkleTreeHash = 80,
    InvalidConsolidationTotalFees = 81,
    InvalidConsolidationMissingBlocks = 82,
    InvalidServiceBlockTotalFees = 83,
    InvalidFeeTicker = 84,
    InvalidAuthorizerCount = 85,
    InvalidAuthorizerInServiceBlock = 86,
    InvalidLeaderInServiceBlock = 87,
    InvalidLeaderInConsolidationBlock = 88,
    InvalidConsolidationBlockContinuty = 89,
    InvalidConsolidationBlockCount = 90,
    InvalidConsolidationBlockHashes = 91,
    InvalidSyncFeeBlock = 92,
    DuplicateReceiveBlock = 100,
    InvalidTokenRenewalDate = 200,
    TokenExpired = 201,
    NameUnavailable = 202,
    DomainNameTooShort = 203,
    EmptyDomainName = 204,
    DomainNameReserved = 205,
    NotAllowedToSign = 300,
    NotAllowedToCommit = 301,
    BlockFailedToBeAuthorized = 302,
    NodeOutOfSync = 303,
    PBFTNetworkNotReadyForConsensus = 304,
    DoubleSpentDetected = 305,
    NotListedAsQualifiedAuthorizer = 306,
    ConsensusTimeout = 307,
    SystemNotReadyToServe = 308,
    InvalidBlockTimeStamp = 309,
    FailedToSyncAccount = 310,
    APIRouteFailed = 311,
    InvalidDomainName = 312,
    InvalidTickerName = 313,
    InvalidAuthorizerSignatureInServiceBlock = 314,
    InvalidTokenPair = 330,
    PoolAlreadyExists = 331,
    PoolNotExists = 332,
    PoolShareNotExists = 333,
    InvalidPoolOperation = 334,
    PoolOperationAlreadyCompleted = 335,
    InvalidPoolDepositionAmount = 336,
    InvalidPoolDepositionRito = 337,
    InvalidPoolWithdrawAccountId = 338,
    InvalidPoolWithdrawAmount = 339,
    InvalidPoolWithdrawRito = 340,
    InvalidTokenToSwap = 341,
    TooManyTokensToSwap = 342,
    InvalidPoolSwapOutToken = 343,
    InvalidPoolSwapOutAmount = 344,
    InvalidPoolSwapOutShare = 345,
    InvalidPoolSwapOutAccountId = 346,
    PoolSwapRitoChanged = 347,
    InvalidSwapSlippage = 348,
    SwapSlippageExcceeded = 349,
    PoolOutOfLiquidaty = 350,
    RequotaNeeded = 351,
    InvalidBlockTags = 352,
    InvalidProfitingAccount = 353,
    VotingDaysTooSmall = 354,
    InvalidShareOfProfit = 355,
    DuplicateName = 356,
    InvalidStakingAccount = 357,
    SystemBusy = 358,
    InvalidName = 359,
    InvalidRelatedTx = 360,
    InvalidTimeRange = 361,
    InvalidShareRitio = 362,
    InvalidSeatsCount = 363,
    InvalidMessengerAccount = 364,
    RequestNotPermited = 365,
    DuplicateAccountType = 366,
    InvalidManagementBlock = 367,
    InvalidBrokerAcount = 368,
    InvalidUnstaking = 369,
    InvalidBalance = 370,
    InvalidOpeningAccount = 371,
    InvalidBlockSequence = 372,
    InvalidManagedTransaction = 373,
    ProfitUnavaliable = 374,
    BlockCompareFailed = 375,
    InvalidAmount = 376,
    InvalidBlockData = 400,
    AccountLockDown = 401,
    UnsupportedBlockType = 402,
    UnsuppportedServiceRequest = 500,
    InvalidServiceRequest = 501,
    Unsupported = 502,
    InvalidExternalToken = 503,
    InvalidTokenMint = 504,
    InvalidTokenBurn = 505,
    InvalidWithdrawToAddress = 506,
    InvalidAccountType = 507,
    UnsupportedDexToken = 508,
    InvalidDexServer = 509,
    InvalidExternalAddress = 510,
    TokenNotFound = 511,
    InvalidOrgnization = 512,
    InvalidOrder = 513,
    InvalidTrade = 514,
    NotOwnerOfTrade = 515,
    NotSellerOfTrade = 516,
    InvalidTradeStatus = 517,
    InvalidOrderStatus = 518,
    InvalidCollateral = 519,
    InputTooLong = 520,
    Exception = 521,
    StorageAPIFailure = 522,
    DealerRoomNotExists = 523,
    NotFound = 524,
    InvalidTagParameters = 525,
    InputTooShort = 526,
    CollateralNotEnough = 527,
    InvalidVote = 528,
    InvalidArgument = 529,
    Unauthorized = 530,
    InvalidDAO = 531,
    NotEnoughVoters = 532,
    InvalidDataType = 533,
    NotImplemented = 534,
    InvalidOperation = 535,
    AlreadyExecuted = 536,
    InvalidToken = 537,
    ResourceIsBusy = 538,
    TradesPending = 539,
    ArgumentOutOfRange = 540,
    PriceChanged = 541,
    InvalidDecimalDigitalCount = 542,
    InvalidDealerServer = 543,
    NotOwnerOfOrder = 544,
    NotRegisteredToDealer = 545,
    ResolutionPending = 546,
    DisputeLevelWasRaised = 547,
    PermissionDenied = 548,
    DisputeCaseWasNotIncluded = 549,
    InvalidVerificationCode = 550,
    InvalidMetadataUri = 551,
    APIIsObsolete = 552,
    TotTransferNotAllowed = 553,
    InvalidProofOfDelivery = 554,
    InvalidFeeRito = 555,
    InvalidPrice = 556,
    DuplicateBlock = 557
}
export declare enum ProfitingType {
    Node = 0,
    Oracle = 1,
    Merchant = 2,
    Yield = 3,
    Orgnization = 4
}
export declare enum AccountChangeTypes {
    Genesis = 0,
    SendToMe = 1,
    ReceiveFromMe = 2,
    MeSend = 3,
    MeReceive = 4,
    MyContract = 5,
    OtherContract = 6
}
export declare class APIResult {
    resultCode: APIResultCodes;
    resultMessage: string;
}
export declare class AuthorizationAPIResult extends APIResult {
    txHash: string;
}
export declare class BlockAPIResult extends APIResult {
    blockData: string;
    resultBlockType: BlockTypes;
    getBlock(): Block;
}
export declare class MultiBlockAPIResult extends APIResult {
    blockDatas: string[];
    resultBlockTypes: BlockTypes[];
    getDaos(): Block[];
}
export declare class SimpleJsonAPIResult extends APIResult {
    jsonString: string;
    getdata(): any;
}
export declare class BalanceChanges {
    changes?: {
        [key: string]: number;
    };
    feeAmount?: number;
    feeCode?: string;
}
export declare class NewTransferAPIResult2 extends APIResult {
    sourceHash: string;
    transfer: BalanceChanges;
    nonFungibleToken?: {};
}
export declare class ImageUploadResult extends APIResult {
    hash: string;
    url: string;
}
export declare class LyraContractABI {
    svcReq: string;
    targetAccountId: string;
    amounts: {
        [key: string]: number;
    };
    objArgument: any;
}
export declare class BrokerActions {
    static readonly BRK_POOL_CRPL = "CRPL";
    static readonly BRK_POOL_ADDLQ = "ADDLQ";
    static readonly BRK_POOL_RMLQ = "RMLQ";
    static readonly BRK_POOL_SWAP = "SWAP";
    static readonly BRK_STK_CRSTK = "CRSTK";
    static readonly BRK_STK_ADDSTK = "ADDSTK";
    static readonly BRK_STK_UNSTK = "UNSTK";
    static readonly BRK_PFT_CRPFT = "CRPFT";
    static readonly BRK_PFT_GETPFT = "GETPFT";
    static readonly BRK_DEX_DPOREQ = "DPOREQ";
    static readonly BRK_DEX_MINT = "MINT";
    static readonly BRK_DEX_GETTKN = "GETTKN";
    static readonly BRK_DEX_PUTTKN = "PUTTKN";
    static readonly BRK_DEX_WDWREQ = "WDWREQ";
    static readonly BRK_FIAT_CRACT = "FATCRACT";
    static readonly BRK_FIAT_PRINT = "FATPRNT";
    static readonly BRK_FIAT_GET = "FATGET";
    static readonly BRK_DAO_CRDAO = "CRDAO";
    static readonly BRK_DAO_JOIN = "JOINDAO";
    static readonly BRK_DAO_LEAVE = "LEAVEDAO";
    static readonly BRK_DAO_CHANGE = "CHANGEDAO";
    static readonly BRK_DAO_VOTED_CHANGE = "VTCHGDAO";
    static readonly BRK_OTC_CRODR = "CRODR";
    static readonly BRK_OTC_CRTRD = "CRTRD";
    static readonly BRK_OTC_TRDPAYSENT = "TRDPAYSNT";
    static readonly BRK_OTC_TRDPAYGOT = "TRDPAYGOT";
    static readonly BRK_OTC_ORDDELST = "ORDDELST";
    static readonly BRK_OTC_ORDCLOSE = "ORDCLOSE";
    static readonly BRK_OTC_TRDCANCEL = "TRDCANCEL";
    static readonly BRK_OTC_CRDPT = "ORDCRDPT";
    static readonly BRK_OTC_RSLDPT = "ORDRSLDPT";
    static readonly BRK_VOT_CREATE = "CRVOTS";
    static readonly BRK_VOT_VOTE = "VOTE";
    static readonly BRK_VOT_CLOSE = "VOTCLS";
    static readonly BRK_DLR_CREATE = "DLRCRT";
    static readonly BRK_DLR_UPDATE = "DLRUPD";
    static readonly BRK_UNI_CRODR = "UCRODR";
    static readonly BRK_UNI_CRTRD = "UCRTRD";
    static readonly BRK_UNI_TRDPAYSENT = "UTRDPAYSNT";
    static readonly BRK_UNI_TRDPAYGOT = "UTRDPAYGOT";
    static readonly BRK_UNI_ORDDELST = "UORDDELST";
    static readonly BRK_UNI_ORDCLOSE = "UORDCLOSE";
    static readonly BRK_UNI_TRDCANCEL = "UTRDCANCEL";
    static readonly BRK_UNI_CRDPT = "UORDCRDPT";
    static readonly BRK_UNI_RSLDPT = "UORDRSLDPT";
}
export declare enum UniOrderStatus {
    Open = 0,
    Partial = 10,
    Closed = 30,
    Delist = 50
}
export declare enum UniTradeStatus {
    Open = 0,
    Processing = 1,
    Closed = 30,
    Dispute = 40,
    DisputeClosed = 45,
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
