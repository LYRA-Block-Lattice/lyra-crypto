import { AuthorizationAPIResult, BlockAPIResult } from "./blocks/meta";
import ky from "ky-universal";

export class BlockchainAPI {
  static networkid: string = "devnet";

  static Block_API_v1: string;
  static Block_API_v2: string;
  static Dealer_API: string;
  static Start_API: string;

  static setNetworkId = (id: string) => {
    BlockchainAPI.networkid = id;

    BlockchainAPI.Block_API_v1 = `https://${this.networkid}.lyra.live/api/node`;
    BlockchainAPI.Block_API_v2 = `https://${this.networkid}.lyra.live/api/EC`;
    BlockchainAPI.Dealer_API = `https://dealer${this.networkid}.lyra.live/api/dealer`;
    BlockchainAPI.Start_API = `https://start${this.networkid}.lyra.live/svc`;
  };

  static getBlockExplorerUrl = (id: string) => {
    switch (this.networkid) {
      case "testnet":
        return "https://nebulatestnet.lyra.live/showblock/" + id;
      case "mainnet":
        return "https://nebula.lyra.live/showblock/" + id;
      default:
        return "https://localhost:5201/showblock/" + id;
    }
  };

  static async fetchJson<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await ky.get(url, options);
    const data = await response.json();
    return data as T;
  }

  static async postJson<T>(
    url: string,
    json: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await ky.post(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: json,
      ...options
    });

    return response.json() as Promise<T>;
  }

  // Blockchain API V1
  static getLastServiceBlock = () =>
    this.fetchJson<BlockAPIResult>(`${this.Block_API_v1}/GetLastServiceBlock`);

  static sendTransfer = (sendBlock: string) =>
    this.postJson<AuthorizationAPIResult>(
      `${this.Block_API_v1}/SendTransfer`,
      sendBlock
    );

  static recvTransfer = (receiveBlock: string) =>
    this.postJson<AuthorizationAPIResult>(
      `${this.Block_API_v1}/ReceiveTransfer`,
      receiveBlock
    );

  static recvTransferWithOpenAccount = (openReceiveBlock: string) =>
    this.postJson<AuthorizationAPIResult>(
      `${this.Block_API_v1}/ReceiveTransferAndOpenAccount`,
      openReceiveBlock
    );

  static mintToken = (tokenBlock: string) =>
    this.postJson<AuthorizationAPIResult>(
      `${this.Block_API_v1}/CreateToken`,
      tokenBlock
    );

  static getUnreceived = (accountId: string) =>
    this.fetchJson<any>(
      `${this.Block_API_v1}/LookForNewTransfer2?AccountId=${accountId}`
    );

  static findFiatWallet = (owner: string, symbol: string) =>
    this.fetchJson<any>(
      `${this.Block_API_v1}/FindFiatWallet?owner=${owner}&symbol=${symbol}`
    );

  static getHistory = (
    accountId: string,
    start: Date,
    end: Date,
    count: number
  ) => {
    const toTicks = (date: Date) => {
      const utcDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60 * 1000
      );

      // Convert the UTC date to a long value
      const longValue = utcDate.getTime();

      // Convert the long value to a .NET DateTime object by ticks
      const ticks = longValue * 10000 + 621355968000000000;
      return ticks;
    };
    return this.fetchJson<any>(
      `${
        this.Block_API_v1
      }/SearchTransactions?accountId=${accountId}&startTimeTicks=${toTicks(
        start
      )}&endTimeTicks=${toTicks(end)}&count=${count}`
    );
  };

  static searchDao = (q: string) =>
    this.fetchJson<any>(`${this.Block_API_v1}/FindDaos?q=${q}`);

  // Get a Tx block by AccountId
  static GetLastBlock = (accountId: string) =>
    this.fetchJson<BlockAPIResult>(
      `${this.Block_API_v1}/GetLastBlock?accountId=${accountId}`
    );

  static getTradeForOrder = (orderId: string) =>
    this.fetchJson<any>(
      `${this.Block_API_v1}/FindUniTradeForOrder?orderid=${orderId}`
    );

  // Blockchain API V2
  static lastServiceHash = () =>
    this.fetchJson<any>(`${this.Block_API_v2}/ServiceHash`);

  static getBalance = (accountId: string) =>
    this.fetchJson<any>(`${this.Block_API_v2}/Balance?accountId=${accountId}`);

  // Dealer API
  static fetchOrders = (catalog: string | undefined) =>
    this.fetchJson<any>(`${this.Dealer_API}/Orders?catalog=${catalog}`);

  static fetchOrderById = (orderId: string) =>
    this.fetchJson<any>(`${this.Dealer_API}/Order?orderId=${orderId}`);

  static fetchOrdersByOwner = (owner: string) =>
    this.fetchJson<any>(`${this.Dealer_API}/OrdersByOwner?ownerId=${owner}`);

  static fetchTradesByOwner = (owner: string) =>
    this.fetchJson<any>(`${this.Dealer_API}/TradesByOwner?ownerId=${owner}`);

  static fetchDealer = () => this.fetchJson<any>(`${this.Dealer_API}/Dealer`);
  static uploadFile = (formData: FormData) =>
    this.postJson<any>(
      `${this.Dealer_API}/UploadFile`,
      JSON.stringify(formData),
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

  // Starter API
  static createNFTMeta = (
    accountId: string,
    signature: string,
    name: string,
    description: string,
    imgUrl: string
  ) => {
    const data = {
      [accountId]: accountId,
      [signature]: signature,
      signatureType: "der",
      name: name,
      description: description,
      imgUrl: imgUrl
    };

    this.postJson<any>(
      `${this.Start_API}/CreateMetaHosted`,
      JSON.stringify(data)
    );
  };
}
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
