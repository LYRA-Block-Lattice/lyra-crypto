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

install:

```
yarn add lyra-crypto
```

call the api:

```
  const pvk = "dkrwRdqNjEEshpLuEPPqc6zM1HM3nzGjsYts39zzA1iUypcpj";
  const wallet = new LyraApi("testnet", pvk);
  await wallet.init();
  const result = await wallet.balance();
```

use a private node:

[Setup Lyra Node in APP mode](https://github.com/LYRA-Block-Lattice/Lyra-Core#run-node-damon-in-app-mode)

```
  const pvk = "dkrwRdqNjEEshpLuEPPqc6zM1HM3nzGjsYts39zzA1iUypcpj";
  const wallet = new LyraApi("testnet", pvk, "192.168.0.1");        // local lyra node
  await wallet.init();
  const result = await wallet.balance();

  const dst =
      "LUTAq9MFf4vaqbEEDHsRj8SUbLWoKptndaUqXSnYbi7mC1cXajts6fWXhQUuwR4ZX7DnvERkUMpwXKf4XKk4NjVMxqYvmn";
  const result2 = await wallet.send(dst, 1, "LYR");

  var delta = result.balance["LYR"] - result2.balance["LYR"];
  // delta === 2

```

[More Example](https://github.com/LYRA-Block-Lattice/lyra-crypto/blob/master/test/crypto.test.ts)
