import JSONbig from "json-bigint";
export var AccountTypes;
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
})(AccountTypes || (AccountTypes = {}));
export var AuthorizationFeeTypes;
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
})(AuthorizationFeeTypes || (AuthorizationFeeTypes = {}));
export var NonFungibleTokenTypes;
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
})(NonFungibleTokenTypes || (NonFungibleTokenTypes = {}));
export var BlockTypes;
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
})(BlockTypes || (BlockTypes = {}));
export var ContractTypes;
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
})(ContractTypes || (ContractTypes = {}));
export var HoldTypes;
(function (HoldTypes) {
    HoldTypes[HoldTypes["Token"] = 0] = "Token";
    HoldTypes[HoldTypes["NFT"] = 1] = "NFT";
    HoldTypes[HoldTypes["Fiat"] = 2] = "Fiat";
    HoldTypes[HoldTypes["TOT"] = 3] = "TOT";
    HoldTypes[HoldTypes["SVC"] = 4] = "SVC";
})(HoldTypes || (HoldTypes = {}));
export function getHoldType(token) {
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
export var APIResultCodes;
(function (APIResultCodes) {
    APIResultCodes[APIResultCodes["Success"] = 0] = "Success";
    APIResultCodes[APIResultCodes["UnknownError"] = 1] = "UnknownError";
    // default error code
    APIResultCodes[APIResultCodes["UndefinedError"] = 1000] = "UndefinedError";
    APIResultCodes[APIResultCodes["BlockWithThisIndexAlreadyExists"] = 2] = "BlockWithThisIndexAlreadyExists";
    APIResultCodes[APIResultCodes["AccountAlreadyExists"] = 3] = "AccountAlreadyExists";
    APIResultCodes[APIResultCodes["AccountDoesNotExist"] = 4] = "AccountDoesNotExist";
    APIResultCodes[APIResultCodes["BlockWithThisPreviousHashAlreadyExists"] = 5] = "BlockWithThisPreviousHashAlreadyExists";
    APIResultCodes[APIResultCodes["BlockValidationFailed"] = 6] = "BlockValidationFailed";
    APIResultCodes[APIResultCodes["TokenGenesisBlockAlreadyExists"] = 7] = "TokenGenesisBlockAlreadyExists";
    APIResultCodes[APIResultCodes["CouldNotFindLatestBlock"] = 8] = "CouldNotFindLatestBlock";
    APIResultCodes[APIResultCodes["NegativeTransactionAmount"] = 9] = "NegativeTransactionAmount";
    APIResultCodes[APIResultCodes["AccountChainBlockValidationFailed"] = 10] = "AccountChainBlockValidationFailed";
    APIResultCodes[APIResultCodes["AccountChainSignatureValidationFailed"] = 11] = "AccountChainSignatureValidationFailed";
    APIResultCodes[APIResultCodes["AccountChainBalanceValidationFailed"] = 12] = "AccountChainBalanceValidationFailed";
    APIResultCodes[APIResultCodes["AccountBlockAlreadyExists"] = 13] = "AccountBlockAlreadyExists";
    APIResultCodes[APIResultCodes["SourceSendBlockNotFound"] = 14] = "SourceSendBlockNotFound";
    APIResultCodes[APIResultCodes["InvalidDestinationAccountId"] = 15] = "InvalidDestinationAccountId";
    APIResultCodes[APIResultCodes["CouldNotTraceSendBlockChain"] = 16] = "CouldNotTraceSendBlockChain";
    APIResultCodes[APIResultCodes["TransactionAmountDoesNotMatch"] = 17] = "TransactionAmountDoesNotMatch";
    APIResultCodes[APIResultCodes["ExceptionInOpenAccountWithGenesis"] = 18] = "ExceptionInOpenAccountWithGenesis";
    APIResultCodes[APIResultCodes["ExceptionInSendTransfer"] = 19] = "ExceptionInSendTransfer";
    APIResultCodes[APIResultCodes["ExceptionInReceiveTransferAndOpenAccount"] = 20] = "ExceptionInReceiveTransferAndOpenAccount";
    APIResultCodes[APIResultCodes["ExceptionInReceiveTransfer"] = 21] = "ExceptionInReceiveTransfer";
    APIResultCodes[APIResultCodes["InvalidBlockType"] = 22] = "InvalidBlockType";
    APIResultCodes[APIResultCodes["ExceptionInCreateToken"] = 23] = "ExceptionInCreateToken";
    APIResultCodes[APIResultCodes["InvalidFeeAmount"] = 24] = "InvalidFeeAmount";
    APIResultCodes[APIResultCodes["InvalidNewAccountBalance"] = 25] = "InvalidNewAccountBalance";
    APIResultCodes[APIResultCodes["SendTransactionValidationFailed"] = 26] = "SendTransactionValidationFailed";
    APIResultCodes[APIResultCodes["ReceiveTransactionValidationFailed"] = 27] = "ReceiveTransactionValidationFailed";
    APIResultCodes[APIResultCodes["TransactionTokenDoesNotMatch"] = 28] = "TransactionTokenDoesNotMatch";
    APIResultCodes[APIResultCodes["BlockSignatureValidationFailed"] = 29] = "BlockSignatureValidationFailed";
    APIResultCodes[APIResultCodes["NoNewTransferFound"] = 30] = "NoNewTransferFound";
    APIResultCodes[APIResultCodes["TokenGenesisBlockNotFound"] = 31] = "TokenGenesisBlockNotFound";
    APIResultCodes[APIResultCodes["ServiceBlockNotFound"] = 32] = "ServiceBlockNotFound";
    APIResultCodes[APIResultCodes["BlockNotFound"] = 33] = "BlockNotFound";
    APIResultCodes[APIResultCodes["NoRPCServerConnection"] = 34] = "NoRPCServerConnection";
    APIResultCodes[APIResultCodes["ExceptionInNodeAPI"] = 35] = "ExceptionInNodeAPI";
    APIResultCodes[APIResultCodes["ExceptionInWebAPI"] = 36] = "ExceptionInWebAPI";
    APIResultCodes[APIResultCodes["PreviousBlockNotFound"] = 37] = "PreviousBlockNotFound";
    APIResultCodes[APIResultCodes["InsufficientFunds"] = 38] = "InsufficientFunds";
    APIResultCodes[APIResultCodes["InvalidAccountId"] = 39] = "InvalidAccountId";
    APIResultCodes[APIResultCodes["InvalidPrivateKey"] = 40] = "InvalidPrivateKey";
    APIResultCodes[APIResultCodes["TradeOrderMatchFound"] = 41] = "TradeOrderMatchFound";
    APIResultCodes[APIResultCodes["InvalidIndexSequence"] = 42] = "InvalidIndexSequence";
    APIResultCodes[APIResultCodes["FeatureIsNotSupported"] = 48] = "FeatureIsNotSupported";
    // Trade Codes
    APIResultCodes[APIResultCodes["ExceptionInTradeOrderAuthorizer"] = 43] = "ExceptionInTradeOrderAuthorizer";
    APIResultCodes[APIResultCodes["ExceptionInTradeAuthorizer"] = 44] = "ExceptionInTradeAuthorizer";
    APIResultCodes[APIResultCodes["ExceptionInExecuteTradeOrderAuthorizer"] = 45] = "ExceptionInExecuteTradeOrderAuthorizer";
    APIResultCodes[APIResultCodes["ExceptionInCancelTradeOrderAuthorizer"] = 46] = "ExceptionInCancelTradeOrderAuthorizer";
    APIResultCodes[APIResultCodes["TradeOrderValidationFailed"] = 47] = "TradeOrderValidationFailed";
    APIResultCodes[APIResultCodes["NoTradesFound"] = 49] = "NoTradesFound";
    APIResultCodes[APIResultCodes["TradeOrderNotFound"] = 50] = "TradeOrderNotFound";
    APIResultCodes[APIResultCodes["InvalidTradeAmount"] = 51] = "InvalidTradeAmount";
    // Non-fungible token codes
    APIResultCodes[APIResultCodes["InvalidNonFungibleAmount"] = 52] = "InvalidNonFungibleAmount";
    APIResultCodes[APIResultCodes["InvalidNonFungibleTokenCode"] = 53] = "InvalidNonFungibleTokenCode";
    APIResultCodes[APIResultCodes["MissingNonFungibleToken"] = 54] = "MissingNonFungibleToken";
    APIResultCodes[APIResultCodes["InvalidNonFungibleSenderAccountId"] = 55] = "InvalidNonFungibleSenderAccountId";
    APIResultCodes[APIResultCodes["NoNonFungibleTokensFound"] = 56] = "NoNonFungibleTokensFound";
    APIResultCodes[APIResultCodes["OriginNonFungibleBlockNotFound"] = 57] = "OriginNonFungibleBlockNotFound";
    APIResultCodes[APIResultCodes["SourceNonFungibleBlockNotFound"] = 58] = "SourceNonFungibleBlockNotFound";
    APIResultCodes[APIResultCodes["OriginNonFungibleBlockHashDoesNotMatch"] = 59] = "OriginNonFungibleBlockHashDoesNotMatch";
    APIResultCodes[APIResultCodes["SourceNonFungibleBlockHashDoesNotMatch"] = 60] = "SourceNonFungibleBlockHashDoesNotMatch";
    APIResultCodes[APIResultCodes["NonFungibleSignatureVerificationFailed"] = 61] = "NonFungibleSignatureVerificationFailed";
    APIResultCodes[APIResultCodes["InvalidNonFungiblePublicKey"] = 62] = "InvalidNonFungiblePublicKey";
    APIResultCodes[APIResultCodes["InvalidNFT"] = 6200] = "InvalidNFT";
    APIResultCodes[APIResultCodes["InvalidCollectibleNFT"] = 6201] = "InvalidCollectibleNFT";
    APIResultCodes[APIResultCodes["DuplicateNFTCollectibleSerialNumber"] = 6202] = "DuplicateNFTCollectibleSerialNumber";
    APIResultCodes[APIResultCodes["NFTCollectibleSerialNumberDoesNotExist"] = 6203] = "NFTCollectibleSerialNumberDoesNotExist";
    APIResultCodes[APIResultCodes["InvalidCollectibleNFTDenomination"] = 6204] = "InvalidCollectibleNFTDenomination";
    APIResultCodes[APIResultCodes["InvalidCollectibleNFTSerialNumber"] = 6205] = "InvalidCollectibleNFTSerialNumber";
    APIResultCodes[APIResultCodes["NFTInstanceNotFound"] = 6206] = "NFTInstanceNotFound";
    APIResultCodes[APIResultCodes["NFTSignaturesDontMatch"] = 6207] = "NFTSignaturesDontMatch";
    APIResultCodes[APIResultCodes["\u0422lockHashDoesNotMatch"] = 59] = "\u0422lockHashDoesNotMatch";
    APIResultCodes[APIResultCodes["CancelTradeOrderValidationFailed"] = 63] = "CancelTradeOrderValidationFailed";
    APIResultCodes[APIResultCodes["InvalidFeeType"] = 64] = "InvalidFeeType";
    APIResultCodes[APIResultCodes["InvalidParameterFormat"] = 65] = "InvalidParameterFormat";
    APIResultCodes[APIResultCodes["APISignatureValidationFailed"] = 66] = "APISignatureValidationFailed";
    APIResultCodes[APIResultCodes["InvalidNetworkId"] = 67] = "InvalidNetworkId";
    APIResultCodes[APIResultCodes["CannotSendToSelf"] = 68] = "CannotSendToSelf";
    APIResultCodes[APIResultCodes["InvalidAmountToSend"] = 69] = "InvalidAmountToSend";
    APIResultCodes[APIResultCodes["InvalidPreviousBlock"] = 70] = "InvalidPreviousBlock";
    APIResultCodes[APIResultCodes["CannotModifyImportedAccount"] = 71] = "CannotModifyImportedAccount";
    APIResultCodes[APIResultCodes["AccountAlreadyImported"] = 72] = "AccountAlreadyImported";
    APIResultCodes[APIResultCodes["CannotImportEmptyAccount"] = 73] = "CannotImportEmptyAccount";
    APIResultCodes[APIResultCodes["CannotImportAccountWithOtherImports"] = 74] = "CannotImportAccountWithOtherImports";
    APIResultCodes[APIResultCodes["ImportTransactionValidationFailed"] = 75] = "ImportTransactionValidationFailed";
    APIResultCodes[APIResultCodes["CannotImportAccountToItself"] = 76] = "CannotImportAccountToItself";
    // service blocks related
    APIResultCodes[APIResultCodes["InvalidConsolidationMerkleTreeHash"] = 80] = "InvalidConsolidationMerkleTreeHash";
    APIResultCodes[APIResultCodes["InvalidConsolidationTotalFees"] = 81] = "InvalidConsolidationTotalFees";
    APIResultCodes[APIResultCodes["InvalidConsolidationMissingBlocks"] = 82] = "InvalidConsolidationMissingBlocks";
    APIResultCodes[APIResultCodes["InvalidServiceBlockTotalFees"] = 83] = "InvalidServiceBlockTotalFees";
    APIResultCodes[APIResultCodes["InvalidFeeTicker"] = 84] = "InvalidFeeTicker";
    APIResultCodes[APIResultCodes["InvalidAuthorizerCount"] = 85] = "InvalidAuthorizerCount";
    APIResultCodes[APIResultCodes["InvalidAuthorizerInServiceBlock"] = 86] = "InvalidAuthorizerInServiceBlock";
    APIResultCodes[APIResultCodes["InvalidLeaderInServiceBlock"] = 87] = "InvalidLeaderInServiceBlock";
    APIResultCodes[APIResultCodes["InvalidLeaderInConsolidationBlock"] = 88] = "InvalidLeaderInConsolidationBlock";
    APIResultCodes[APIResultCodes["InvalidConsolidationBlockContinuty"] = 89] = "InvalidConsolidationBlockContinuty";
    APIResultCodes[APIResultCodes["InvalidConsolidationBlockCount"] = 90] = "InvalidConsolidationBlockCount";
    APIResultCodes[APIResultCodes["InvalidConsolidationBlockHashes"] = 91] = "InvalidConsolidationBlockHashes";
    APIResultCodes[APIResultCodes["InvalidSyncFeeBlock"] = 92] = "InvalidSyncFeeBlock";
    APIResultCodes[APIResultCodes["DuplicateReceiveBlock"] = 100] = "DuplicateReceiveBlock";
    APIResultCodes[APIResultCodes["InvalidTokenRenewalDate"] = 200] = "InvalidTokenRenewalDate";
    APIResultCodes[APIResultCodes["TokenExpired"] = 201] = "TokenExpired";
    APIResultCodes[APIResultCodes["NameUnavailable"] = 202] = "NameUnavailable";
    APIResultCodes[APIResultCodes["DomainNameTooShort"] = 203] = "DomainNameTooShort";
    APIResultCodes[APIResultCodes["EmptyDomainName"] = 204] = "EmptyDomainName";
    APIResultCodes[APIResultCodes["DomainNameReserved"] = 205] = "DomainNameReserved";
    APIResultCodes[APIResultCodes["NotAllowedToSign"] = 300] = "NotAllowedToSign";
    APIResultCodes[APIResultCodes["NotAllowedToCommit"] = 301] = "NotAllowedToCommit";
    APIResultCodes[APIResultCodes["BlockFailedToBeAuthorized"] = 302] = "BlockFailedToBeAuthorized";
    APIResultCodes[APIResultCodes["NodeOutOfSync"] = 303] = "NodeOutOfSync";
    APIResultCodes[APIResultCodes["PBFTNetworkNotReadyForConsensus"] = 304] = "PBFTNetworkNotReadyForConsensus";
    APIResultCodes[APIResultCodes["DoubleSpentDetected"] = 305] = "DoubleSpentDetected";
    APIResultCodes[APIResultCodes["NotListedAsQualifiedAuthorizer"] = 306] = "NotListedAsQualifiedAuthorizer";
    APIResultCodes[APIResultCodes["ConsensusTimeout"] = 307] = "ConsensusTimeout";
    APIResultCodes[APIResultCodes["SystemNotReadyToServe"] = 308] = "SystemNotReadyToServe";
    APIResultCodes[APIResultCodes["InvalidBlockTimeStamp"] = 309] = "InvalidBlockTimeStamp";
    APIResultCodes[APIResultCodes["FailedToSyncAccount"] = 310] = "FailedToSyncAccount";
    APIResultCodes[APIResultCodes["APIRouteFailed"] = 311] = "APIRouteFailed";
    APIResultCodes[APIResultCodes["InvalidDomainName"] = 312] = "InvalidDomainName";
    APIResultCodes[APIResultCodes["InvalidTickerName"] = 313] = "InvalidTickerName";
    APIResultCodes[APIResultCodes["InvalidAuthorizerSignatureInServiceBlock"] = 314] = "InvalidAuthorizerSignatureInServiceBlock";
    APIResultCodes[APIResultCodes["InvalidTokenPair"] = 330] = "InvalidTokenPair";
    APIResultCodes[APIResultCodes["PoolAlreadyExists"] = 331] = "PoolAlreadyExists";
    APIResultCodes[APIResultCodes["PoolNotExists"] = 332] = "PoolNotExists";
    APIResultCodes[APIResultCodes["PoolShareNotExists"] = 333] = "PoolShareNotExists";
    APIResultCodes[APIResultCodes["InvalidPoolOperation"] = 334] = "InvalidPoolOperation";
    APIResultCodes[APIResultCodes["PoolOperationAlreadyCompleted"] = 335] = "PoolOperationAlreadyCompleted";
    APIResultCodes[APIResultCodes["InvalidPoolDepositionAmount"] = 336] = "InvalidPoolDepositionAmount";
    APIResultCodes[APIResultCodes["InvalidPoolDepositionRito"] = 337] = "InvalidPoolDepositionRito";
    APIResultCodes[APIResultCodes["InvalidPoolWithdrawAccountId"] = 338] = "InvalidPoolWithdrawAccountId";
    APIResultCodes[APIResultCodes["InvalidPoolWithdrawAmount"] = 339] = "InvalidPoolWithdrawAmount";
    APIResultCodes[APIResultCodes["InvalidPoolWithdrawRito"] = 340] = "InvalidPoolWithdrawRito";
    APIResultCodes[APIResultCodes["InvalidTokenToSwap"] = 341] = "InvalidTokenToSwap";
    APIResultCodes[APIResultCodes["TooManyTokensToSwap"] = 342] = "TooManyTokensToSwap";
    APIResultCodes[APIResultCodes["InvalidPoolSwapOutToken"] = 343] = "InvalidPoolSwapOutToken";
    APIResultCodes[APIResultCodes["InvalidPoolSwapOutAmount"] = 344] = "InvalidPoolSwapOutAmount";
    APIResultCodes[APIResultCodes["InvalidPoolSwapOutShare"] = 345] = "InvalidPoolSwapOutShare";
    APIResultCodes[APIResultCodes["InvalidPoolSwapOutAccountId"] = 346] = "InvalidPoolSwapOutAccountId";
    APIResultCodes[APIResultCodes["PoolSwapRitoChanged"] = 347] = "PoolSwapRitoChanged";
    APIResultCodes[APIResultCodes["InvalidSwapSlippage"] = 348] = "InvalidSwapSlippage";
    APIResultCodes[APIResultCodes["SwapSlippageExcceeded"] = 349] = "SwapSlippageExcceeded";
    APIResultCodes[APIResultCodes["PoolOutOfLiquidaty"] = 350] = "PoolOutOfLiquidaty";
    APIResultCodes[APIResultCodes["RequotaNeeded"] = 351] = "RequotaNeeded";
    APIResultCodes[APIResultCodes["InvalidBlockTags"] = 352] = "InvalidBlockTags";
    APIResultCodes[APIResultCodes["InvalidProfitingAccount"] = 353] = "InvalidProfitingAccount";
    APIResultCodes[APIResultCodes["VotingDaysTooSmall"] = 354] = "VotingDaysTooSmall";
    APIResultCodes[APIResultCodes["InvalidShareOfProfit"] = 355] = "InvalidShareOfProfit";
    APIResultCodes[APIResultCodes["DuplicateName"] = 356] = "DuplicateName";
    APIResultCodes[APIResultCodes["InvalidStakingAccount"] = 357] = "InvalidStakingAccount";
    APIResultCodes[APIResultCodes["SystemBusy"] = 358] = "SystemBusy";
    APIResultCodes[APIResultCodes["InvalidName"] = 359] = "InvalidName";
    APIResultCodes[APIResultCodes["InvalidRelatedTx"] = 360] = "InvalidRelatedTx";
    APIResultCodes[APIResultCodes["InvalidTimeRange"] = 361] = "InvalidTimeRange";
    APIResultCodes[APIResultCodes["InvalidShareRitio"] = 362] = "InvalidShareRitio";
    APIResultCodes[APIResultCodes["InvalidSeatsCount"] = 363] = "InvalidSeatsCount";
    APIResultCodes[APIResultCodes["InvalidMessengerAccount"] = 364] = "InvalidMessengerAccount";
    APIResultCodes[APIResultCodes["RequestNotPermited"] = 365] = "RequestNotPermited";
    APIResultCodes[APIResultCodes["DuplicateAccountType"] = 366] = "DuplicateAccountType";
    APIResultCodes[APIResultCodes["InvalidManagementBlock"] = 367] = "InvalidManagementBlock";
    APIResultCodes[APIResultCodes["InvalidBrokerAcount"] = 368] = "InvalidBrokerAcount";
    APIResultCodes[APIResultCodes["InvalidUnstaking"] = 369] = "InvalidUnstaking";
    APIResultCodes[APIResultCodes["InvalidBalance"] = 370] = "InvalidBalance";
    APIResultCodes[APIResultCodes["InvalidOpeningAccount"] = 371] = "InvalidOpeningAccount";
    APIResultCodes[APIResultCodes["InvalidBlockSequence"] = 372] = "InvalidBlockSequence";
    APIResultCodes[APIResultCodes["InvalidManagedTransaction"] = 373] = "InvalidManagedTransaction";
    APIResultCodes[APIResultCodes["ProfitUnavaliable"] = 374] = "ProfitUnavaliable";
    APIResultCodes[APIResultCodes["BlockCompareFailed"] = 375] = "BlockCompareFailed";
    APIResultCodes[APIResultCodes["InvalidAmount"] = 376] = "InvalidAmount";
    APIResultCodes[APIResultCodes["InvalidBlockData"] = 400] = "InvalidBlockData";
    APIResultCodes[APIResultCodes["AccountLockDown"] = 401] = "AccountLockDown";
    APIResultCodes[APIResultCodes["UnsupportedBlockType"] = 402] = "UnsupportedBlockType";
    APIResultCodes[APIResultCodes["UnsuppportedServiceRequest"] = 500] = "UnsuppportedServiceRequest";
    APIResultCodes[APIResultCodes["InvalidServiceRequest"] = 501] = "InvalidServiceRequest";
    APIResultCodes[APIResultCodes["Unsupported"] = 502] = "Unsupported";
    APIResultCodes[APIResultCodes["InvalidExternalToken"] = 503] = "InvalidExternalToken";
    APIResultCodes[APIResultCodes["InvalidTokenMint"] = 504] = "InvalidTokenMint";
    APIResultCodes[APIResultCodes["InvalidTokenBurn"] = 505] = "InvalidTokenBurn";
    APIResultCodes[APIResultCodes["InvalidWithdrawToAddress"] = 506] = "InvalidWithdrawToAddress";
    APIResultCodes[APIResultCodes["InvalidAccountType"] = 507] = "InvalidAccountType";
    APIResultCodes[APIResultCodes["UnsupportedDexToken"] = 508] = "UnsupportedDexToken";
    APIResultCodes[APIResultCodes["InvalidDexServer"] = 509] = "InvalidDexServer";
    APIResultCodes[APIResultCodes["InvalidExternalAddress"] = 510] = "InvalidExternalAddress";
    APIResultCodes[APIResultCodes["TokenNotFound"] = 511] = "TokenNotFound";
    APIResultCodes[APIResultCodes["InvalidOrgnization"] = 512] = "InvalidOrgnization";
    APIResultCodes[APIResultCodes["InvalidOrder"] = 513] = "InvalidOrder";
    APIResultCodes[APIResultCodes["InvalidTrade"] = 514] = "InvalidTrade";
    APIResultCodes[APIResultCodes["NotOwnerOfTrade"] = 515] = "NotOwnerOfTrade";
    APIResultCodes[APIResultCodes["NotSellerOfTrade"] = 516] = "NotSellerOfTrade";
    APIResultCodes[APIResultCodes["InvalidTradeStatus"] = 517] = "InvalidTradeStatus";
    APIResultCodes[APIResultCodes["InvalidOrderStatus"] = 518] = "InvalidOrderStatus";
    APIResultCodes[APIResultCodes["InvalidCollateral"] = 519] = "InvalidCollateral";
    APIResultCodes[APIResultCodes["InputTooLong"] = 520] = "InputTooLong";
    APIResultCodes[APIResultCodes["Exception"] = 521] = "Exception";
    APIResultCodes[APIResultCodes["StorageAPIFailure"] = 522] = "StorageAPIFailure";
    APIResultCodes[APIResultCodes["DealerRoomNotExists"] = 523] = "DealerRoomNotExists";
    APIResultCodes[APIResultCodes["NotFound"] = 524] = "NotFound";
    APIResultCodes[APIResultCodes["InvalidTagParameters"] = 525] = "InvalidTagParameters";
    APIResultCodes[APIResultCodes["InputTooShort"] = 526] = "InputTooShort";
    APIResultCodes[APIResultCodes["CollateralNotEnough"] = 527] = "CollateralNotEnough";
    APIResultCodes[APIResultCodes["InvalidVote"] = 528] = "InvalidVote";
    APIResultCodes[APIResultCodes["InvalidArgument"] = 529] = "InvalidArgument";
    APIResultCodes[APIResultCodes["Unauthorized"] = 530] = "Unauthorized";
    APIResultCodes[APIResultCodes["InvalidDAO"] = 531] = "InvalidDAO";
    APIResultCodes[APIResultCodes["NotEnoughVoters"] = 532] = "NotEnoughVoters";
    APIResultCodes[APIResultCodes["InvalidDataType"] = 533] = "InvalidDataType";
    APIResultCodes[APIResultCodes["NotImplemented"] = 534] = "NotImplemented";
    APIResultCodes[APIResultCodes["InvalidOperation"] = 535] = "InvalidOperation";
    APIResultCodes[APIResultCodes["AlreadyExecuted"] = 536] = "AlreadyExecuted";
    APIResultCodes[APIResultCodes["InvalidToken"] = 537] = "InvalidToken";
    APIResultCodes[APIResultCodes["ResourceIsBusy"] = 538] = "ResourceIsBusy";
    APIResultCodes[APIResultCodes["TradesPending"] = 539] = "TradesPending";
    APIResultCodes[APIResultCodes["ArgumentOutOfRange"] = 540] = "ArgumentOutOfRange";
    APIResultCodes[APIResultCodes["PriceChanged"] = 541] = "PriceChanged";
    APIResultCodes[APIResultCodes["InvalidDecimalDigitalCount"] = 542] = "InvalidDecimalDigitalCount";
    APIResultCodes[APIResultCodes["InvalidDealerServer"] = 543] = "InvalidDealerServer";
    APIResultCodes[APIResultCodes["NotOwnerOfOrder"] = 544] = "NotOwnerOfOrder";
    APIResultCodes[APIResultCodes["NotRegisteredToDealer"] = 545] = "NotRegisteredToDealer";
    APIResultCodes[APIResultCodes["ResolutionPending"] = 546] = "ResolutionPending";
    APIResultCodes[APIResultCodes["DisputeLevelWasRaised"] = 547] = "DisputeLevelWasRaised";
    APIResultCodes[APIResultCodes["PermissionDenied"] = 548] = "PermissionDenied";
    APIResultCodes[APIResultCodes["DisputeCaseWasNotIncluded"] = 549] = "DisputeCaseWasNotIncluded";
    APIResultCodes[APIResultCodes["InvalidVerificationCode"] = 550] = "InvalidVerificationCode";
    APIResultCodes[APIResultCodes["InvalidMetadataUri"] = 551] = "InvalidMetadataUri";
    APIResultCodes[APIResultCodes["APIIsObsolete"] = 552] = "APIIsObsolete";
    APIResultCodes[APIResultCodes["TotTransferNotAllowed"] = 553] = "TotTransferNotAllowed";
    APIResultCodes[APIResultCodes["InvalidProofOfDelivery"] = 554] = "InvalidProofOfDelivery";
    APIResultCodes[APIResultCodes["InvalidFeeRito"] = 555] = "InvalidFeeRito";
    APIResultCodes[APIResultCodes["InvalidPrice"] = 556] = "InvalidPrice";
    APIResultCodes[APIResultCodes["DuplicateBlock"] = 557] = "DuplicateBlock";
})(APIResultCodes || (APIResultCodes = {}));
export var ProfitingType;
(function (ProfitingType) {
    ProfitingType[ProfitingType["Node"] = 0] = "Node";
    ProfitingType[ProfitingType["Oracle"] = 1] = "Oracle";
    ProfitingType[ProfitingType["Merchant"] = 2] = "Merchant";
    ProfitingType[ProfitingType["Yield"] = 3] = "Yield";
    ProfitingType[ProfitingType["Orgnization"] = 4] = "Orgnization";
})(ProfitingType || (ProfitingType = {}));
export var AccountChangeTypes;
(function (AccountChangeTypes) {
    AccountChangeTypes[AccountChangeTypes["Genesis"] = 0] = "Genesis";
    AccountChangeTypes[AccountChangeTypes["SendToMe"] = 1] = "SendToMe";
    AccountChangeTypes[AccountChangeTypes["ReceiveFromMe"] = 2] = "ReceiveFromMe";
    AccountChangeTypes[AccountChangeTypes["MeSend"] = 3] = "MeSend";
    AccountChangeTypes[AccountChangeTypes["MeReceive"] = 4] = "MeReceive";
    AccountChangeTypes[AccountChangeTypes["MyContract"] = 5] = "MyContract";
    AccountChangeTypes[AccountChangeTypes["OtherContract"] = 6] = "OtherContract";
})(AccountChangeTypes || (AccountChangeTypes = {}));
export class APIResult {
}
export class AuthorizationAPIResult extends APIResult {
}
export class BlockAPIResult extends APIResult {
    getBlock() {
        return JSONbig.parse(this.blockData);
    }
}
export class MultiBlockAPIResult extends APIResult {
    getDaos() {
        const blocks = [];
        for (let i = 0; i < this.blockDatas.length; i++) {
            blocks.push(JSON.parse(this.blockDatas[i]));
        }
        return blocks;
    }
}
export class SimpleJsonAPIResult extends APIResult {
    getdata() {
        return JSON.parse(this.jsonString);
    }
}
export class BalanceChanges {
}
export class NewTransferAPIResult2 extends APIResult {
}
export class ImageUploadResult extends APIResult {
}
export class LyraContractABI {
}
class BrokerActions {
}
BrokerActions.BRK_POOL_CRPL = "CRPL";
BrokerActions.BRK_POOL_ADDLQ = "ADDLQ";
BrokerActions.BRK_POOL_RMLQ = "RMLQ";
BrokerActions.BRK_POOL_SWAP = "SWAP";
BrokerActions.BRK_STK_CRSTK = "CRSTK";
BrokerActions.BRK_STK_ADDSTK = "ADDSTK";
BrokerActions.BRK_STK_UNSTK = "UNSTK";
BrokerActions.BRK_PFT_CRPFT = "CRPFT";
//public static readonly BRK_PFT_FEEPFT = "FEEPFT";    // combine to getpft
BrokerActions.BRK_PFT_GETPFT = "GETPFT";
//public static readonly BRK_MCT_CRMCT = "CRMCT";
//public static readonly BRK_MCT_PAYMCT = "PAYMCT";
//public static readonly BRK_MCT_UNPAY = "UNPAY";
//public static readonly BRK_MCT_CFPAY = "CFPAY";
//public static readonly BRK_MCT_GETPAY = "GETPAY";
// DEX
BrokerActions.BRK_DEX_DPOREQ = "DPOREQ";
BrokerActions.BRK_DEX_MINT = "MINT";
BrokerActions.BRK_DEX_GETTKN = "GETTKN";
BrokerActions.BRK_DEX_PUTTKN = "PUTTKN";
BrokerActions.BRK_DEX_WDWREQ = "WDWREQ";
// Fiat
BrokerActions.BRK_FIAT_CRACT = "FATCRACT";
BrokerActions.BRK_FIAT_PRINT = "FATPRNT";
BrokerActions.BRK_FIAT_GET = "FATGET";
// DAO
BrokerActions.BRK_DAO_CRDAO = "CRDAO";
BrokerActions.BRK_DAO_JOIN = "JOINDAO";
BrokerActions.BRK_DAO_LEAVE = "LEAVEDAO";
BrokerActions.BRK_DAO_CHANGE = "CHANGEDAO";
BrokerActions.BRK_DAO_VOTED_CHANGE = "VTCHGDAO";
// OTC
BrokerActions.BRK_OTC_CRODR = "CRODR";
BrokerActions.BRK_OTC_CRTRD = "CRTRD";
BrokerActions.BRK_OTC_TRDPAYSENT = "TRDPAYSNT";
BrokerActions.BRK_OTC_TRDPAYGOT = "TRDPAYGOT";
BrokerActions.BRK_OTC_ORDDELST = "ORDDELST";
BrokerActions.BRK_OTC_ORDCLOSE = "ORDCLOSE";
BrokerActions.BRK_OTC_TRDCANCEL = "TRDCANCEL";
// OTC Dispute
BrokerActions.BRK_OTC_CRDPT = "ORDCRDPT";
BrokerActions.BRK_OTC_RSLDPT = "ORDRSLDPT";
// Voting
BrokerActions.BRK_VOT_CREATE = "CRVOTS";
BrokerActions.BRK_VOT_VOTE = "VOTE";
BrokerActions.BRK_VOT_CLOSE = "VOTCLS";
// Dealer
BrokerActions.BRK_DLR_CREATE = "DLRCRT";
BrokerActions.BRK_DLR_UPDATE = "DLRUPD";
// Universal Order/Trade
BrokerActions.BRK_UNI_CRODR = "UCRODR";
BrokerActions.BRK_UNI_CRTRD = "UCRTRD";
BrokerActions.BRK_UNI_TRDPAYSENT = "UTRDPAYSNT";
BrokerActions.BRK_UNI_TRDPAYGOT = "UTRDPAYGOT";
BrokerActions.BRK_UNI_ORDDELST = "UORDDELST";
BrokerActions.BRK_UNI_ORDCLOSE = "UORDCLOSE";
BrokerActions.BRK_UNI_TRDCANCEL = "UTRDCANCEL";
// Universal Dispute
BrokerActions.BRK_UNI_CRDPT = "UORDCRDPT";
BrokerActions.BRK_UNI_RSLDPT = "UORDRSLDPT";
export { BrokerActions };
export var UniOrderStatus;
(function (UniOrderStatus) {
    UniOrderStatus[UniOrderStatus["Open"] = 0] = "Open";
    UniOrderStatus[UniOrderStatus["Partial"] = 10] = "Partial";
    UniOrderStatus[UniOrderStatus["Closed"] = 30] = "Closed";
    UniOrderStatus[UniOrderStatus["Delist"] = 50] = "Delist"; // prevent order from trading, but wait for all trading finished. after which order can be closed.
})(UniOrderStatus || (UniOrderStatus = {}));
export var UniTradeStatus;
(function (UniTradeStatus) {
    // start
    UniTradeStatus[UniTradeStatus["Open"] = 0] = "Open";
    // trade begins
    UniTradeStatus[UniTradeStatus["Processing"] = 1] = "Processing";
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
    UniTradeStatus[UniTradeStatus["Closed"] = 30] = "Closed";
    // trade in abnormal states
    UniTradeStatus[UniTradeStatus["Dispute"] = 40] = "Dispute";
    UniTradeStatus[UniTradeStatus["DisputeClosed"] = 45] = "DisputeClosed";
    // canceled trade. not count.
    UniTradeStatus[UniTradeStatus["Canceled"] = 50] = "Canceled";
})(UniTradeStatus || (UniTradeStatus = {}));
