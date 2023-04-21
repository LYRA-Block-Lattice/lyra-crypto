"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainAPI = void 0;
const class_transformer_1 = require("class-transformer");
const meta_1 = require("./blocks/meta");
const axios_1 = __importDefault(require("axios"));
class BlockchainAPI {
    static async fetchJson(url, options = {}) {
        // 设置默认超时为30秒（30000毫秒）
        const defaultTimeout = { timeout: 30000 };
        // 使用传入的options与默认超时合并，调用者的设置优先
        const mergedOptions = { ...defaultTimeout, ...options };
        const response = await axios_1.default.get(url, mergedOptions);
        const data = await response.data;
        return data;
    }
    static async postJson(url, json, options) {
        console.log("Posting to ", url);
        const response = await axios_1.default.post(url, json, {
            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            },
            ...options
        });
        return response.data;
    }
}
exports.BlockchainAPI = BlockchainAPI;
_a = BlockchainAPI;
BlockchainAPI.networkid = "testnet";
BlockchainAPI.setNetworkId = (id) => {
    console.log("setNetworkId", id);
    _a.networkid = id || "devnet";
    _a.Block_API_v1 = `https://${_a.networkid}.lyra.live/api/node`;
    _a.Block_API_v2 = `https://${_a.networkid}.lyra.live/api/EC`;
    _a.Dealer_API = `https://dealer${_a.networkid === "mainnet" ? "" : _a.networkid}.lyra.live/api/dealer`;
    _a.Start_API = `https://start${_a.networkid === "mainnet" ? "" : _a.networkid}.lyra.live/svc`;
};
BlockchainAPI.getBlockExplorerUrl = (id) => {
    switch (_a.networkid) {
        case "testnet":
            return "https://nebulatestnet.lyra.live/showblock/" + id;
        case "mainnet":
            return "https://nebula.lyra.live/showblock/" + id;
        default:
            return "https://localhost:5201/showblock/" + id;
    }
};
BlockchainAPI.fetchJson2 = async (resultType, url, options = {}) => {
    const response = await axios_1.default.get(url, options);
    const data = await response.data;
    const result = (0, class_transformer_1.plainToClass)(resultType, data);
    return result;
};
// Blockchain API V1
BlockchainAPI.getLastServiceBlock = () => _a.fetchJson(`${_a.Block_API_v1}/GetLastServiceBlock`);
BlockchainAPI.sendTransfer = (sendBlock) => _a.postJson(`${_a.Block_API_v1}/SendTransfer`, sendBlock);
BlockchainAPI.recvTransfer = (receiveBlock) => _a.postJson(`${_a.Block_API_v1}/ReceiveTransfer`, receiveBlock);
BlockchainAPI.recvTransferWithOpenAccount = (openReceiveBlock) => _a.postJson(`${_a.Block_API_v1}/ReceiveTransferAndOpenAccount`, openReceiveBlock);
BlockchainAPI.mintToken = (tokenBlock) => _a.postJson(`${_a.Block_API_v1}/CreateToken`, tokenBlock);
BlockchainAPI.getUnreceived = (accountId) => _a.fetchJson2(meta_1.NewTransferAPIResult2, `${_a.Block_API_v1}/LookForNewTransfer2?AccountId=${accountId}`);
BlockchainAPI.findTokens = (keyword, cat) => _a.fetchJson(`${_a.Block_API_v1}/FindTokens?q=${keyword}&cat=${cat}`);
BlockchainAPI.getBlockBySourceHash = (hash) => _a.fetchJson2(meta_1.BlockAPIResult, `${_a.Block_API_v1}/GetBlockBySourceHash?Hash=${hash}`);
BlockchainAPI.findFiatWallet = (owner, symbol) => _a.fetchJson2(meta_1.BlockAPIResult, `${_a.Block_API_v1}/FindFiatWallet?owner=${owner}&symbol=${symbol}`);
BlockchainAPI.getHistory = (accountId, start, end, count) => {
    const toTicks = (date) => {
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        // Convert the UTC date to a long value
        const longValue = utcDate.getTime();
        // Convert the long value to a .NET DateTime object by ticks
        const ticks = longValue * 10000 + 621355968000000000;
        return ticks;
    };
    return _a.fetchJson(`${_a.Block_API_v1}/SearchTransactions?accountId=${accountId}&startTimeTicks=${toTicks(start)}&endTimeTicks=${toTicks(end)}&count=${count}`);
};
BlockchainAPI.searchDao = (q) => _a.fetchJson2(meta_1.MultiBlockAPIResult, `${_a.Block_API_v1}/FindDaos?q=${q}`);
// Get a Tx block by AccountId
BlockchainAPI.GetLastBlock = (accountId) => _a.fetchJson(`${_a.Block_API_v1}/GetLastBlock?accountId=${accountId}`);
BlockchainAPI.getTradeForOrder = (orderId) => _a.fetchJson(`${_a.Block_API_v1}/FindUniTradeForOrder?orderid=${orderId}`);
// Blockchain API V2
BlockchainAPI.lastServiceHash = () => _a.fetchJson(`${_a.Block_API_v2}/ServiceHash`);
BlockchainAPI.getBalance = (accountId) => _a.fetchJson(`${_a.Block_API_v2}/Balance?accountId=${accountId}`);
// Dealer API
BlockchainAPI.startWallet = (accountId, signature) => _a.fetchJson2(meta_1.APIResult, `${_a.Dealer_API}/WalletCreated?accountId=${accountId}&signature=${signature}`);
BlockchainAPI.getPrices = async () => _a.fetchJson2(meta_1.SimpleJsonAPIResult, `${_a.Dealer_API}/GetPrices`);
BlockchainAPI.fetchOrders = (catalog) => _a.fetchJson(`${_a.Dealer_API}/Orders?catalog=${catalog}`);
BlockchainAPI.fetchOrderById = (orderId) => _a.fetchJson(`${_a.Dealer_API}/Order?orderId=${orderId}`);
BlockchainAPI.fetchOrdersByOwner = (owner) => _a.fetchJson(`${_a.Dealer_API}/OrdersByOwner?ownerId=${owner}`);
BlockchainAPI.fetchTradesByOwner = (owner) => _a.fetchJson(`${_a.Dealer_API}/TradesByOwner?ownerId=${owner}`);
BlockchainAPI.fetchDealer = () => _a.fetchJson(`${_a.Dealer_API}/Dealer`);
BlockchainAPI.uploadFile = async (theForm) => {
    const url = `${_a.Dealer_API}/UploadFile`;
    console.log("uploading file to " + url);
    const ret = await axios_1.default.post(url, theForm, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        timeout: 300000 // 5 minutes
    });
    const jsonString = ret.data;
    const data = JSON.parse(jsonString);
    return data;
    // const result = plainToClass(ImageUploadResult, ret.text());
    // return result;
};
// Starter API
BlockchainAPI.createNFTMeta = (accountId, signature, name, description, imgUrl) => {
    const data = {
        accountId: accountId,
        signature: signature,
        name: name,
        description: description,
        imgUrl: imgUrl
    };
    // just to get a url. so use ImageUploadResult as a hack
    return _a.postJson(`${_a.Start_API}/CreateMetaHosted`, JSON.stringify(data));
};
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("profile")) {
//     req.headers.Authorization = `LyraDeX ${
//       JSON.parse(localStorage.getItem("profile")).token
//     }`;
//   }
//   return req;
// });
// fetchPosts = () => API.get("/posts");
// createPost = (newPost) => API.post("/posts", newPost);
// likePost = (id) => API.patch(`/posts/${id}/likePost`);
// updatePost = (id, updatedPost) =>
//   API.patch(`/posts/${id}`, updatedPost);
// deletePost = (id) => API.delete(`/posts/${id}`);
// signIn = (formData) => API.post("/user/signin", formData);
// signUp = (formData) => API.post("/user/signup", formData);
