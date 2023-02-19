"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainAPI = void 0;
class BlockchainAPI {
    static async fetchJson(url, options = {}) {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return data;
    }
    static async postJson(url, json, options) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            },
            body: json,
            ...options
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}
exports.BlockchainAPI = BlockchainAPI;
_a = BlockchainAPI;
BlockchainAPI.networkid = "devnet";
BlockchainAPI.setNetworkId = (id) => {
    BlockchainAPI.networkid = id;
    BlockchainAPI.Block_API_v1 = `https://${_a.networkid}.lyra.live/api/node`;
    BlockchainAPI.Block_API_v2 = `https://${_a.networkid}.lyra.live/api/EC`;
    BlockchainAPI.Dealer_API = `https://dealer${_a.networkid}.lyra.live/api/dealer`;
    BlockchainAPI.Start_API = `https://start${_a.networkid}.lyra.live/svc`;
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
// Blockchain API V1
BlockchainAPI.getLastServiceBlock = () => _a.fetchJson(`${_a.Block_API_v1}/GetLastServiceBlock`);
BlockchainAPI.sendTransfer = (sendBlock) => _a.postJson(`${_a.Block_API_v1}/SendTransfer`, sendBlock);
BlockchainAPI.recvTransfer = (receiveBlock) => _a.postJson(`${_a.Block_API_v1}/ReceiveTransfer`, receiveBlock);
BlockchainAPI.recvTransferWithOpenAccount = (openReceiveBlock) => _a.postJson(`${_a.Block_API_v1}/ReceiveTransferAndOpenAccount`, openReceiveBlock);
BlockchainAPI.mintToken = (tokenBlock) => _a.postJson(`${_a.Block_API_v1}/CreateToken`, tokenBlock);
BlockchainAPI.getUnreceived = (accountId) => _a.fetchJson(`${_a.Block_API_v1}/LookForNewTransfer2?AccountId=${accountId}`);
BlockchainAPI.findFiatWallet = (owner, symbol) => _a.fetchJson(`${_a.Block_API_v1}/FindFiatWallet?owner=${owner}&symbol=${symbol}`);
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
BlockchainAPI.searchDao = (q) => _a.fetchJson(`${_a.Block_API_v1}/FindDaos?q=${q}`);
// Get a Tx block by AccountId
BlockchainAPI.GetLastBlock = (accountId) => _a.fetchJson(`${_a.Block_API_v1}/GetLastBlock?accountId=${accountId}`);
BlockchainAPI.getTradeForOrder = (orderId) => _a.fetchJson(`${_a.Block_API_v1}/FindUniTradeForOrder?orderid=${orderId}`);
// Blockchain API V2
BlockchainAPI.lastServiceHash = () => _a.fetchJson(`${_a.Block_API_v2}/ServiceHash`);
BlockchainAPI.getBalance = (accountId) => _a.fetchJson(`${_a.Block_API_v2}/Balance?accountId=${accountId}`);
// Dealer API
BlockchainAPI.fetchOrders = (catalog) => _a.fetchJson(`${_a.Dealer_API}/Orders?catalog=${catalog}`);
BlockchainAPI.fetchOrderById = (orderId) => _a.fetchJson(`${_a.Dealer_API}/Order?orderId=${orderId}`);
BlockchainAPI.fetchOrdersByOwner = (owner) => _a.fetchJson(`${_a.Dealer_API}/OrdersByOwner?ownerId=${owner}`);
BlockchainAPI.fetchTradesByOwner = (owner) => _a.fetchJson(`${_a.Dealer_API}/TradesByOwner?ownerId=${owner}`);
BlockchainAPI.fetchDealer = () => _a.fetchJson(`${_a.Dealer_API}/Dealer`);
BlockchainAPI.uploadFile = (formData) => _a.postJson(`${_a.Dealer_API}/UploadFile`, JSON.stringify(formData), {
    method: "POST",
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
// Starter API
BlockchainAPI.createNFTMeta = (accountId, signature, name, description, imgUrl) => {
    const data = {
        [accountId]: accountId,
        [signature]: signature,
        signatureType: "der",
        name: name,
        description: description,
        imgUrl: imgUrl
    };
    fetch(`${_a.Start_API}/CreateMetaHosted`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
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
