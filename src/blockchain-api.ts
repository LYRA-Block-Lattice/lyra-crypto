import { plainToClass } from "class-transformer";

import {
  APIResult,
  AuthorizationAPIResult,
  BlockAPIResult,
  ImageUploadResult,
  MultiBlockAPIResult,
  NewTransferAPIResult2,
  NftMetadata,
  SimpleJsonAPIResult
} from "./blocks/meta";

import { Block, IDao, IUniOrder, TokenGenesisBlock } from "./blocks/block";
import axios, { AxiosRequestConfig } from "axios";

export type FindToken = {
  token: string;
  domain: string;
  isTOT: boolean;
  name: string;
};

export type FindTokenList = FindToken[];
export interface IOrdersResult {
  OverStats: { _id: number; Count: number }[];
  OwnerStats: {
    _id: {
      Owner: string;
      State: number;
      Name: string;
      Avatar: string;
    };
    Count: number;
  }[];
  Daos: IDao[]; // could be a more specific type if we know the shape of the data
  Orders: any[]; // could be a more specific type if we know the shape of the data
}

export interface IOwnerOrder {
  daoid: string;
  orderid: string;
  status: string;
  offering: string;
  biding: string;
  amount: number;
  price: number;
  limitmin: number;
  limitmax: number;
  time: string;
  sold: number;
  shelf: number;
}

export interface IOwnerTrade {
  dir: string;
  tradeId: string;
  status: string;
  offering: string;
  biding: string;
  amount: number;
  price: number;
  time: string;
}

export interface IDealerOrder {
  OrderId: string;
  Blocks: {
    Order: IUniOrder;
    Offgen: TokenGenesisBlock;
    Bidgen: TokenGenesisBlock;
    Dao: IDao;
  };
  Users: {
    Seller: {
      UserName: string;
      AccountId: string;
      AvatarId: string;
    };
    Author: {
      UserName: string;
      AccountId: string;
      AvatarId: string;
    };
  };
  Meta: NftMetadata;
}

export interface IDealerInfo {
  Version: string;
  Name: string;
  AccountId: string;
  ServiceId: string;
  TelegramBotUsername: string;
}

type Constructor<T> = new () => T;

export class BlockchainAPI {
  static networkid: string = "testnet";

  static Block_API_v1: string;
  static Block_API_v2: string;
  static Dealer_API: string;
  static Start_API: string;

  static setNetworkId = (id: string | undefined) => {
    console.log("setNetworkId", id);
    this.networkid = id || "devnet";

    this.Block_API_v1 = `https://${this.networkid}.lyra.live/api/node`;
    this.Block_API_v2 = `https://${this.networkid}.lyra.live/api/EC`;
    this.Dealer_API = `https://dealer${
      this.networkid === "mainnet" ? "" : this.networkid
    }.lyra.live/api/dealer`;
    this.Start_API = `https://start${
      this.networkid === "mainnet" ? "" : this.networkid
    }.lyra.live/svc`;
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

  static fetchJson2 = async <T>(
    resultType: Constructor<T>,
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const response = await axios.get(url, options);
    const data = await response.data;
    const result = plainToClass(resultType, data);
    return result;
  };

  static async fetchJson<T>(
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    // 设置默认超时为30秒（30000毫秒）
    const defaultTimeout = { timeout: 30000 };

    // 使用传入的options与默认超时合并，调用者的设置优先
    const mergedOptions = { ...defaultTimeout, ...options };

    const response = await axios.get(url, mergedOptions);
    const data = await response.data;
    return data as T;
  }

  static async postJson<T>(
    url: string,
    json: any,
    options?: AxiosRequestConfig
  ): Promise<T> {
    console.log("Posting to ", url);
    const response = await axios.post(url, json, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      ...options
    });

    return response.data as Promise<T>;
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
    this.fetchJson2(
      NewTransferAPIResult2,
      `${this.Block_API_v1}/LookForNewTransfer2?AccountId=${accountId}`
    );

  static findTokens = (keyword: string, cat: string) =>
    this.fetchJson<FindTokenList>(
      `${this.Block_API_v1}/FindTokens?q=${keyword}&cat=${cat}`
    );

  static getBlockBySourceHash = (hash: string) =>
    this.fetchJson2(
      BlockAPIResult,
      `${this.Block_API_v1}/GetBlockBySourceHash?Hash=${hash}`
    );

  static findFiatWallet = (owner: string, symbol: string) =>
    this.fetchJson2(
      BlockAPIResult,
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
    this.fetchJson2(
      MultiBlockAPIResult,
      `${this.Block_API_v1}/FindDaos?q=${q}`
    );

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
  static startWallet = (accountId: string, signature: string) =>
    this.fetchJson2(
      APIResult,
      `${this.Dealer_API}/WalletCreated?accountId=${accountId}&signature=${signature}`
    );

  static getPrices = async (): Promise<SimpleJsonAPIResult> =>
    this.fetchJson2(SimpleJsonAPIResult, `${this.Dealer_API}/GetPrices`);

  static fetchOrders = (catalog: string | undefined) =>
    this.fetchJson<IOrdersResult>(
      `${this.Dealer_API}/Orders?catalog=${catalog}`
    );

  static fetchOrderById = (orderId: string) =>
    this.fetchJson<IDealerOrder>(`${this.Dealer_API}/Order?orderId=${orderId}`);

  static fetchOrdersByOwner = (owner: string) =>
    this.fetchJson<IOwnerOrder[]>(
      `${this.Dealer_API}/OrdersByOwner?ownerId=${owner}`
    );

  static fetchTradesByOwner = (owner: string) =>
    this.fetchJson<IOwnerTrade[]>(
      `${this.Dealer_API}/TradesByOwner?ownerId=${owner}`
    );

  static fetchDealer = () =>
    this.fetchJson<IDealerInfo>(`${this.Dealer_API}/Dealer`);

  static uploadFile = async (theForm: FormData): Promise<ImageUploadResult> => {
    const url = `${this.Dealer_API}/UploadFile`;
    console.log("uploading file to " + url);
    const ret = await axios.post(url, theForm, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 300000 // 5 minutes
    });
    const jsonString = ret.data;
    const data = JSON.parse(jsonString) as ImageUploadResult;
    return data;
    // const result = plainToClass(ImageUploadResult, ret.text());
    // return result;
  };

  // Starter API
  static createNFTMeta = (
    accountId: string,
    signature: string,
    name: string,
    description: string,
    imgUrl: string
  ) => {
    const data = {
      accountId: accountId,
      signature: signature,
      name: name,
      description: description,
      imgUrl: imgUrl
    };

    // just to get a url. so use ImageUploadResult as a hack
    return this.postJson<ImageUploadResult>(
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
