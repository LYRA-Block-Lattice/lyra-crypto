"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNFTMeta = exports.uploadFile = exports.fetchDealer = exports.fetchTradesByOwner = exports.fetchOrdersByOwner = exports.fetchOrderById = exports.fetchOrders = exports.getBalance = exports.lastServiceHash = exports.getTradeForOrder = exports.GetLastBlock = exports.searchDao = exports.sendTransfer = exports.getBlockExplorerUrl = exports.InitAxios = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const InitAxios = () => {
    axios_1.default.interceptors.request.use((request) => {
        console.log("Starting Request", JSON.stringify(request, null, 2));
        return request;
    });
    axios_1.default.interceptors.response.use((response) => {
        console.log("Response:", JSON.stringify(response, null, 2));
        return response;
    });
};
exports.InitAxios = InitAxios;
const Block_API_v1 = axios_1.default.create({
    baseURL: `https://${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/node`
});
const Block_API_v2 = axios_1.default.create({
    baseURL: `https://${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/EC`
});
const Dealer_API = axios_1.default.create({
    baseURL: `https://dealer${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/dealer`
});
const Start_API = axios_1.default.create({
    baseURL: `https://start${process.env.REACT_APP_NETWORK_ID}.lyra.live/svc`
});
const getBlockExplorerUrl = (id) => {
    switch (process.env.REACT_APP_NETWORK_ID) {
        case "testnet":
            return "https://nebulatestnet.lyra.live/showblock/" + id;
        case "mainnet":
            return "https://nebula.lyra.live/showblock/" + id;
        default:
            return "https://localhost:5201/showblock/" + id;
    }
};
exports.getBlockExplorerUrl = getBlockExplorerUrl;
// Blockchain API V1
const sendTransfer = (sendBlock) => Block_API_v1.post("/SendTransfer", sendBlock, {
    headers: {
        "Content-Type": "text/json"
    }
});
exports.sendTransfer = sendTransfer;
const searchDao = (q) => Block_API_v1.get("/FindDaos?q=" + q);
exports.searchDao = searchDao;
// Get a Tx block by AccountId
const GetLastBlock = (accountId) => Block_API_v1.get("/GetLastBlock?accountId=" + accountId);
exports.GetLastBlock = GetLastBlock;
const getTradeForOrder = (orderId) => Block_API_v1.get("/FindUniTradeForOrder?orderid=" + orderId);
exports.getTradeForOrder = getTradeForOrder;
// Blockchain API V2
const lastServiceHash = () => Block_API_v2.get("/ServiceHash");
exports.lastServiceHash = lastServiceHash;
const getBalance = (accountId) => Block_API_v2.get("/Balance?accountId=" + accountId);
exports.getBalance = getBalance;
// Dealer API
const fetchOrders = (catalog) => Dealer_API.get("/Orders?catalog=" + catalog);
exports.fetchOrders = fetchOrders;
const fetchOrderById = (orderId) => Dealer_API.get("/Order?orderId=" + orderId);
exports.fetchOrderById = fetchOrderById;
const fetchOrdersByOwner = (owner) => Dealer_API.get("/OrdersByOwner?ownerId=" + owner);
exports.fetchOrdersByOwner = fetchOrdersByOwner;
const fetchTradesByOwner = (owner) => Dealer_API.get("/TradesByOwner?ownerId=" + owner);
exports.fetchTradesByOwner = fetchTradesByOwner;
const fetchDealer = () => Dealer_API.get("/Dealer");
exports.fetchDealer = fetchDealer;
const uploadFile = (formData) => Dealer_API.post("/UploadFile", formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
exports.uploadFile = uploadFile;
// Starter API
const createNFTMeta = (accountId, signature, name, description, imgUrl) => Start_API.post("/CreateMetaHosted", {
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
exports.createNFTMeta = createNFTMeta;
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("profile")) {
//     req.headers.Authorization = `LyraDeX ${
//       JSON.parse(localStorage.getItem("profile")).token
//     }`;
//   }
//   return req;
// });
// export const fetchPosts = () => API.get("/posts");
// export const createPost = (newPost) => API.post("/posts", newPost);
// export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
// export const updatePost = (id, updatedPost) =>
//   API.patch(`/posts/${id}`, updatedPost);
// export const deletePost = (id) => API.delete(`/posts/${id}`);
// export const signIn = (formData) => API.post("/user/signin", formData);
// export const signUp = (formData) => API.post("/user/signup", formData);
