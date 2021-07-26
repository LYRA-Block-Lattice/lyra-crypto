# lyra-crypto

Javascript library to do crypto for Lyra blockchain.

- LyraCrypto class

```
class LyraCrypto {
    static isAccountIdValid(accountId: string): boolean;
    static isPrivateKeyValid(privateKey: string): boolean;
    static GenerateWallet(): {
        privateKey: any;
        accountId: string;
    };
    static Sign(msg: string, privateKey: string): any;
    static Verify(msg: string, accountId: string, sigval: string): any;
    static GetAccountIdFromPrivateKey(privateKey: string): string | undefined;
}


```

- LyraAPI class

```
class LyraAPI {
    constructor(network: string, privateKey: string, node?: string);
    async init();

    async balance() : {};
    async send(destAddr: string, amount: number, token: string) : {};
    async receive() : {};
}

API returns (example):

{
    "balance": {
      "LYR": 33670.46319139,
      "testit/json-5963500": 3000000.0,
      "unittest/trans": 49999991619.64198
    },
    "unreceived": true
}

```

- Usage

```
  const pvk = "dkrwRdqNjEEshpLuEPPqc6zM1HM3nzGjsYts39zzA1iUypcpj";
  const wallet = new LyraApi("testnet", pvk);
  await wallet.init();
  const result = await wallet.balance();
```
