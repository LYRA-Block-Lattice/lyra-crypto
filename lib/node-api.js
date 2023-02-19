"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class BlockchainAPI {
    receiveTransfer(finalJson) {
        throw new Error("Function not implemented.");
    }
    getUnreceivedBlocks(accountId) {
        throw new Error("Function not implemented.");
    }
}
exports.default = BlockchainAPI;
_a = BlockchainAPI;
BlockchainAPI.networkid = "devnet";
BlockchainAPI.setNetworkId = (id) => {
    _a.networkid = id;
};
BlockchainAPI.InitAxios = () => {
    axios_1.default.interceptors.request.use((request) => {
        console.log("Starting Request", JSON.stringify(request, null, 2));
        return request;
    });
    axios_1.default.interceptors.response.use((response) => {
        console.log("Response:", JSON.stringify(response, null, 2));
        return response;
    });
};
BlockchainAPI.Block_API_v1 = axios_1.default.create({
    baseURL: `https://${_a.networkid}.lyra.live/api/node`
});
BlockchainAPI.Block_API_v2 = axios_1.default.create({
    baseURL: `https://${_a.networkid}.lyra.live/api/EC`
});
BlockchainAPI.Dealer_API = axios_1.default.create({
    baseURL: `https://dealer${_a.networkid}.lyra.live/api/dealer`
});
BlockchainAPI.Start_API = axios_1.default.create({
    baseURL: `https://start${_a.networkid}.lyra.live/svc`
});
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
// Blockchain API V1
BlockchainAPI.getLastServiceBlock = () => _a.Block_API_v1.get("/GetLastServiceBlock");
BlockchainAPI.sendTransfer = (sendBlock) => _a.Block_API_v1.post("/SendTransfer", sendBlock, {
    headers: {
        "Content-Type": "text/json"
    }
});
BlockchainAPI.recvTransfer = (receiveBlock) => _a.Block_API_v1.post("/ReceiveTransfer", receiveBlock, {
    headers: {
        "Content-Type": "text/json"
    }
});
BlockchainAPI.recvTransferWithOpenAccount = (openReceiveBlock) => _a.Block_API_v1.post("/ReceiveTransferAndOpenAccount", openReceiveBlock, {
    headers: {
        "Content-Type": "text/json"
    }
});
BlockchainAPI.mintToken = (tokenBlock) => _a.Block_API_v1.post("/CreateToken", tokenBlock, {
    headers: {
        "Content-Type": "text/json"
    }
});
BlockchainAPI.getUnreceived = (accountId) => _a.Block_API_v1.get("/LookForNewTransfer2?AccountId=" + accountId);
BlockchainAPI.findFiatWallet = (owner, symbol) => _a.Block_API_v1.get("/FindFiatWallet?owner=" + owner + "&symbol=" + symbol);
BlockchainAPI.getHistory = (accountId, start, end, count) => {
    const toTicks = (date) => {
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        // Convert the UTC date to a long value
        const longValue = utcDate.getTime();
        // Convert the long value to a .NET DateTime object by ticks
        const ticks = longValue * 10000 + 621355968000000000;
        return ticks;
    };
    return _a.Block_API_v1.get("/SearchTransactions?accountId=" +
        accountId +
        "&startTimeTicks=" +
        toTicks(start) +
        "&endTimeTicks=" +
        toTicks(end) +
        "&count=" +
        count);
};
BlockchainAPI.searchDao = (q) => _a.Block_API_v1.get("/FindDaos?q=" + q);
// Get a Tx block by AccountId
BlockchainAPI.GetLastBlock = (accountId) => _a.Block_API_v1.get("/GetLastBlock?accountId=" + accountId);
BlockchainAPI.getTradeForOrder = (orderId) => _a.Block_API_v1.get("/FindUniTradeForOrder?orderid=" + orderId);
// Blockchain API V2
BlockchainAPI.lastServiceHash = () => _a.Block_API_v2.get("/ServiceHash");
BlockchainAPI.getBalance = (accountId) => _a.Block_API_v2.get("/Balance?accountId=" + accountId);
// Dealer API
BlockchainAPI.fetchOrders = (catalog) => _a.Dealer_API.get("/Orders?catalog=" + catalog);
BlockchainAPI.fetchOrderById = (orderId) => _a.Dealer_API.get("/Order?orderId=" + orderId);
BlockchainAPI.fetchOrdersByOwner = (owner) => _a.Dealer_API.get("/OrdersByOwner?ownerId=" + owner);
BlockchainAPI.fetchTradesByOwner = (owner) => _a.Dealer_API.get("/TradesByOwner?ownerId=" + owner);
BlockchainAPI.fetchDealer = () => _a.Dealer_API.get("/Dealer");
BlockchainAPI.uploadFile = (formData) => _a.Dealer_API.post("/UploadFile", formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
// Starter API
BlockchainAPI.createNFTMeta = (accountId, signature, name, description, imgUrl) => _a.Start_API.post("/CreateMetaHosted", {
    accountId: accountId,
    signature: signature,
    signatureType: "der",
    name: name,
    description: description,
    imgUrl: imgUrl
}, {
    headers: {
        "Content-Type": "application/json"
    }
});
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
