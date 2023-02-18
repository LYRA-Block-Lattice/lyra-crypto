"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonFungibleTokenTypes = exports.ContractTypes = exports.BlockTypes = exports.AuthorizationFeeTypes = exports.AccountTypes = void 0;
var AccountTypes;
(function (AccountTypes) {
    AccountTypes[AccountTypes["Standard"] = 1] = "Standard";
    AccountTypes[AccountTypes["Savings"] = 2] = "Savings";
    AccountTypes[AccountTypes["Service"] = 3] = "Service";
    AccountTypes[AccountTypes["PoolFactory"] = 5] = "PoolFactory";
    AccountTypes[AccountTypes["Pool"] = 6] = "Pool";
    AccountTypes[AccountTypes["Staking"] = 7] = "Staking";
    AccountTypes[AccountTypes["Profiting"] = 8] = "Profiting";
    AccountTypes[AccountTypes["DEX"] = 9] = "DEX";
    AccountTypes[AccountTypes["DAO"] = 10] = "DAO";
    AccountTypes[AccountTypes["OTC"] = 11] = "OTC";
    AccountTypes[AccountTypes["Voting"] = 12] = "Voting";
    AccountTypes[AccountTypes["Server"] = 13] = "Server";
    AccountTypes[AccountTypes["Guild"] = 14] = "Guild";
    AccountTypes[AccountTypes["NFT"] = 30] = "NFT";
    AccountTypes[AccountTypes["Fiat"] = 31] = "Fiat";
    AccountTypes[AccountTypes["TOT"] = 32] = "TOT";
})(AccountTypes = exports.AccountTypes || (exports.AccountTypes = {}));
var AuthorizationFeeTypes;
(function (AuthorizationFeeTypes) {
    /// <summary>
    /// No authorization fee is included in the block.
    /// The fee is either not required for this block or paid by the second party.
    /// </summary>
    AuthorizationFeeTypes[AuthorizationFeeTypes["NoFee"] = 0] = "NoFee";
    /// <summary>
    /// The regualr fee is included in the block.
    /// The second party ether does not exist, or both parties of the transaction pay an equal amount of fee set by the network.
    /// </summary>
    AuthorizationFeeTypes[AuthorizationFeeTypes["Regular"] = 1] = "Regular";
    /// <summary>
    /// Doubled fee is included in the block.
    /// The second party of the transaction won't need to pay any fee.
    /// </summary>
    AuthorizationFeeTypes[AuthorizationFeeTypes["BothParties"] = 2] = "BothParties";
    /// <summary>
    /// dynamic calculated, like swap, with ratio, etc.
    /// </summary>
    AuthorizationFeeTypes[AuthorizationFeeTypes["Dynamic"] = 3] = "Dynamic";
    /// <summary>
    /// all funds are fees
    /// </summary>
    AuthorizationFeeTypes[AuthorizationFeeTypes["FullFee"] = 4] = "FullFee";
})(AuthorizationFeeTypes = exports.AuthorizationFeeTypes || (exports.AuthorizationFeeTypes = {}));
var BlockTypes;
(function (BlockTypes) {
    BlockTypes[BlockTypes["Null"] = 0] = "Null";
    //NullTransaction = 1,
    // Network service blocks
    //ServiceGenesis = 10,
    BlockTypes[BlockTypes["Service"] = 11] = "Service";
    BlockTypes[BlockTypes["Consolidation"] = 12] = "Consolidation";
    BlockTypes[BlockTypes["Sync"] = 13] = "Sync";
    // Opening blocks
    // This is the very first block that creates Lyra Gas token on primary shard
    BlockTypes[BlockTypes["LyraTokenGenesis"] = 20] = "LyraTokenGenesis";
    // account opening block where the first transaction is receive transfer
    BlockTypes[BlockTypes["OpenAccountWithReceiveTransfer"] = 21] = "OpenAccountWithReceiveTransfer";
    // the same as OpenWithReceiveTransfer Block but tells the authorizer that it received fee instead of regular transfer
    BlockTypes[BlockTypes["OpenAccountWithReceiveFee"] = 22] = "OpenAccountWithReceiveFee";
    // Open a new account and import another account
    BlockTypes[BlockTypes["OpenAccountWithImport"] = 23] = "OpenAccountWithImport";
    BlockTypes[BlockTypes["ReceiveAsFee"] = 24] = "ReceiveAsFee";
    // Transaction blocks
    BlockTypes[BlockTypes["TokenGenesis"] = 30] = "TokenGenesis";
    BlockTypes[BlockTypes["SendTransfer"] = 31] = "SendTransfer";
    BlockTypes[BlockTypes["ReceiveTransfer"] = 32] = "ReceiveTransfer";
    // adds tarnsfers' fee to authorizer's account,
    // the fee is settled when a new sync or service block is generated, for the previous service Index,
    // by summarizing all the fee amounts from all blocks with the same corresponding sefrviceblock hash and dividing it by the number of authorizers in the sample,
    // the block can be validated by the next sample and all other nores in the same way,
    // fee data is not encrypted
    BlockTypes[BlockTypes["ReceiveFee"] = 33] = "ReceiveFee";
    // Imports an account into current account
    BlockTypes[BlockTypes["ImportAccount"] = 34] = "ImportAccount";
    BlockTypes[BlockTypes["ReceiveMultipleFee"] = 35] = "ReceiveMultipleFee";
    BlockTypes[BlockTypes["ReceiveAuthorizerFee"] = 36] = "ReceiveAuthorizerFee";
    BlockTypes[BlockTypes["ReceiveNodeProfit"] = 37] = "ReceiveNodeProfit";
    // Trading blocks
    // Put Sell or Buy trade order to exchange tokens
    BlockTypes[BlockTypes["TradeOrder"] = 40] = "TradeOrder";
    // Send tokens to the trade order to initiate trade
    BlockTypes[BlockTypes["Trade"] = 41] = "Trade";
    // Exchange tokens with Trade initiator to conclude the trade and execute the trade order
    BlockTypes[BlockTypes["ExecuteTradeOrder"] = 42] = "ExecuteTradeOrder";
    // Cancels the order and frees up the locked funds
    BlockTypes[BlockTypes["CancelTradeOrder"] = 43] = "CancelTradeOrder";
    // Liquidate Pool
    BlockTypes[BlockTypes["PoolFactory"] = 50] = "PoolFactory";
    BlockTypes[BlockTypes["PoolGenesis"] = 51] = "PoolGenesis";
    BlockTypes[BlockTypes["PoolDeposit"] = 52] = "PoolDeposit";
    BlockTypes[BlockTypes["PoolWithdraw"] = 53] = "PoolWithdraw";
    BlockTypes[BlockTypes["PoolSwapIn"] = 54] = "PoolSwapIn";
    BlockTypes[BlockTypes["PoolSwapOut"] = 55] = "PoolSwapOut";
    BlockTypes[BlockTypes["PoolRefundRecv"] = 56] = "PoolRefundRecv";
    BlockTypes[BlockTypes["PoolRefundSend"] = 57] = "PoolRefundSend";
    // staking
    BlockTypes[BlockTypes["ProfitingGenesis"] = 60] = "ProfitingGenesis";
    BlockTypes[BlockTypes["Profiting"] = 61] = "Profiting";
    BlockTypes[BlockTypes["Benefiting"] = 62] = "Benefiting";
    BlockTypes[BlockTypes["StakingGenesis"] = 65] = "StakingGenesis";
    BlockTypes[BlockTypes["Staking"] = 66] = "Staking";
    BlockTypes[BlockTypes["UnStaking"] = 67] = "UnStaking";
    // DEX
    BlockTypes[BlockTypes["DexWalletGenesis"] = 70] = "DexWalletGenesis";
    BlockTypes[BlockTypes["DexTokenMint"] = 71] = "DexTokenMint";
    BlockTypes[BlockTypes["DexTokenBurn"] = 72] = "DexTokenBurn";
    BlockTypes[BlockTypes["DexSendToken"] = 73] = "DexSendToken";
    BlockTypes[BlockTypes["DexRecvToken"] = 74] = "DexRecvToken";
    BlockTypes[BlockTypes["DexWithdrawToken"] = 75] = "DexWithdrawToken";
    // DAO
    BlockTypes[BlockTypes["OrgnizationRecv"] = 80] = "OrgnizationRecv";
    BlockTypes[BlockTypes["OrgnizationGenesis"] = 81] = "OrgnizationGenesis";
    BlockTypes[BlockTypes["OrgnizationSend"] = 82] = "OrgnizationSend";
    BlockTypes[BlockTypes["OrgnizationChange"] = 83] = "OrgnizationChange";
    // OTC
    BlockTypes[BlockTypes["OTCOrderRecv"] = 84] = "OTCOrderRecv";
    BlockTypes[BlockTypes["OTCOrderGenesis"] = 85] = "OTCOrderGenesis";
    BlockTypes[BlockTypes["OTCOrderSend"] = 86] = "OTCOrderSend";
    BlockTypes[BlockTypes["OTCTradeRecv"] = 87] = "OTCTradeRecv";
    BlockTypes[BlockTypes["OTCTradeGenesis"] = 88] = "OTCTradeGenesis";
    BlockTypes[BlockTypes["OTCTradeSend"] = 89] = "OTCTradeSend";
    BlockTypes[BlockTypes["OTCTradeResolutionRecv"] = 90] = "OTCTradeResolutionRecv";
    // voting
    BlockTypes[BlockTypes["VoteGenesis"] = 100] = "VoteGenesis";
    BlockTypes[BlockTypes["Voting"] = 101] = "Voting";
    BlockTypes[BlockTypes["VotingRefund"] = 102] = "VotingRefund";
    // Dealer
    BlockTypes[BlockTypes["DealerRecv"] = 105] = "DealerRecv";
    BlockTypes[BlockTypes["DealerSend"] = 106] = "DealerSend";
    BlockTypes[BlockTypes["DealerGenesis"] = 107] = "DealerGenesis";
    // Universal Order
    BlockTypes[BlockTypes["UniOrderRecv"] = 110] = "UniOrderRecv";
    BlockTypes[BlockTypes["UniOrderGenesis"] = 111] = "UniOrderGenesis";
    BlockTypes[BlockTypes["UniOrderSend"] = 112] = "UniOrderSend";
    BlockTypes[BlockTypes["UniTradeRecv"] = 113] = "UniTradeRecv";
    BlockTypes[BlockTypes["UniTradeGenesis"] = 114] = "UniTradeGenesis";
    BlockTypes[BlockTypes["UniTradeSend"] = 115] = "UniTradeSend";
    BlockTypes[BlockTypes["UniTradeResolutionRecv"] = 116] = "UniTradeResolutionRecv";
    // NFT
    //NFTGenesis = 110,     // not needed. a normal genesis block can handle it.
    BlockTypes[BlockTypes["GuildRecv"] = 120] = "GuildRecv";
    BlockTypes[BlockTypes["GuildSend"] = 121] = "GuildSend";
    BlockTypes[BlockTypes["GuildGenesis"] = 122] = "GuildGenesis";
    // Fiat
    BlockTypes[BlockTypes["FiatWalletGenesis"] = 130] = "FiatWalletGenesis";
    BlockTypes[BlockTypes["FiatTokenPrint"] = 131] = "FiatTokenPrint";
    BlockTypes[BlockTypes["FiatTokenBurn"] = 132] = "FiatTokenBurn";
    BlockTypes[BlockTypes["FiatSendToken"] = 133] = "FiatSendToken";
    BlockTypes[BlockTypes["FiatRecvToken"] = 134] = "FiatRecvToken";
})(BlockTypes = exports.BlockTypes || (exports.BlockTypes = {}));
var ContractTypes;
(function (ContractTypes) {
    ContractTypes[ContractTypes["Default"] = 0] = "Default";
    ContractTypes[ContractTypes["RewardPoint"] = 10] = "RewardPoint";
    ContractTypes[ContractTypes["RedeemedDiscount"] = 20] = "RedeemedDiscount";
    ContractTypes[ContractTypes["GiftCard"] = 30] = "GiftCard";
    ContractTypes[ContractTypes["DiscountCoupon"] = 40] = "DiscountCoupon";
    ContractTypes[ContractTypes["StoreCredit"] = 50] = "StoreCredit";
    ContractTypes[ContractTypes["Cryptocurrency"] = 100] = "Cryptocurrency";
    ContractTypes[ContractTypes["FiatCurrency"] = 200] = "FiatCurrency";
    ContractTypes[ContractTypes["Collectible"] = 300] = "Collectible";
    ContractTypes[ContractTypes["TradeOnlyToken"] = 400] = "TradeOnlyToken";
    ContractTypes[ContractTypes["Custom"] = 1000] = "Custom";
})(ContractTypes = exports.ContractTypes || (exports.ContractTypes = {}));
var NonFungibleTokenTypes;
(function (NonFungibleTokenTypes) {
    NonFungibleTokenTypes[NonFungibleTokenTypes["NotSet"] = 0] = "NotSet";
    // LoyalShopper Shopify discount code
    NonFungibleTokenTypes[NonFungibleTokenTypes["LoyaltyDiscount"] = 1] = "LoyaltyDiscount";
    // Lyra or Custom Collectible NFT
    NonFungibleTokenTypes[NonFungibleTokenTypes["Collectible"] = 2] = "Collectible";
    // trade only token
    NonFungibleTokenTypes[NonFungibleTokenTypes["TradeOnly"] = 3] = "TradeOnly";
    // external NFT
    //ERC1155 = 3,
})(NonFungibleTokenTypes = exports.NonFungibleTokenTypes || (exports.NonFungibleTokenTypes = {}));
