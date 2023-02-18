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
