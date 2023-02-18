import axios from "axios";
require("dotenv").config();

export const InitAxios = () => {
  axios.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request, null, 2));
    return request;
  });

  axios.interceptors.response.use((response) => {
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  });
};

const Block_API_v1 = axios.create({
  baseURL: `https://${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/node`
});

const Block_API_v2 = axios.create({
  baseURL: `https://${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/EC`
});

const Dealer_API = axios.create({
  baseURL: `https://dealer${process.env.REACT_APP_NETWORK_ID}.lyra.live/api/dealer`
});

const Start_API = axios.create({
  baseURL: `https://start${process.env.REACT_APP_NETWORK_ID}.lyra.live/svc`
});

export const getBlockExplorerUrl = (id: string) => {
  switch (process.env.REACT_APP_NETWORK_ID) {
    case "testnet":
      return "https://nebulatestnet.lyra.live/showblock/" + id;
    case "mainnet":
      return "https://nebula.lyra.live/showblock/" + id;
    default:
      return "https://localhost:5201/showblock/" + id;
  }
};

// Blockchain API V1
export const getLastServiceBlock = () =>
  Block_API_v1.get("/GetLastServiceBlock");
export const sendTransfer = (sendBlock: string) =>
  Block_API_v1.post("/SendTransfer", sendBlock, {
    headers: {
      "Content-Type": "text/json"
    }
  });
export const recvTransfer = (receiveBlock: string) =>
  Block_API_v1.post("/ReceiveTransfer", receiveBlock, {
    headers: {
      "Content-Type": "text/json"
    }
  });
export const mintToken = (tokenBlock: string) =>
  Block_API_v1.post("/CreateToken", tokenBlock, {
    headers: {
      "Content-Type": "text/json"
    }
  });
export const getUnreceived = (accountId: string) =>
  Block_API_v1.get("/LookForNewTransfer2?AccountId=" + accountId);
export const searchDao = (q: string) => Block_API_v1.get("/FindDaos?q=" + q);
// Get a Tx block by AccountId
export const GetLastBlock = (accountId: string) =>
  Block_API_v1.get("/GetLastBlock?accountId=" + accountId);
export const getTradeForOrder = (orderId: string) =>
  Block_API_v1.get("/FindUniTradeForOrder?orderid=" + orderId);

// Blockchain API V2
export const lastServiceHash = () => Block_API_v2.get("/ServiceHash");
export const getBalance = (accountId: string) =>
  Block_API_v2.get("/Balance?accountId=" + accountId);

// Dealer API
export const fetchOrders = (catalog: string | undefined) =>
  Dealer_API.get("/Orders?catalog=" + catalog);

export const fetchOrderById = (orderId: string) =>
  Dealer_API.get("/Order?orderId=" + orderId);

export const fetchOrdersByOwner = (owner: string) =>
  Dealer_API.get("/OrdersByOwner?ownerId=" + owner);

export const fetchTradesByOwner = (owner: string) =>
  Dealer_API.get("/TradesByOwner?ownerId=" + owner);

export const fetchDealer = () => Dealer_API.get("/Dealer");
export const uploadFile = (formData: FormData) =>
  Dealer_API.post("/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

// Starter API
export const createNFTMeta = (
  accountId: string,
  signature: string,
  name: string,
  description: string,
  imgUrl: string
) =>
  Start_API.post(
    "/CreateMetaHosted",
    {
      accountId: accountId,
      signature: signature,
      signatureType: "der",
      name: name,
      description: description,
      imgUrl: imgUrl
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

export function receiveTransfer(finalJson: string) {
  throw new Error("Function not implemented.");
}

export function getUnreceivedBlocks(accountId: string) {
  throw new Error("Function not implemented.");
}
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
