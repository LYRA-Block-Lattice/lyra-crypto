# lyra-crypto

Javascript library to do crypto for Lyra blockchain. This client lib works with any Lyra node. [Lyra JsonRPC API Specification](https://github.com/LYRA-Block-Lattice/Lyra-Core/blob/master/docs/JsonRPC.md)

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

    async balance() : {};       // return balance
    async send(amount: number, destAddr: string, token: string) : {};   // return balance
    async receive() : {};       // return balance
    async history() : {};       // return tx array
    close();
}

API returns (example):

* balance

{
    "balance": {
      "LYR": 33670.46319139,
      "testit/json-5963500": 3000000.0,
      "unittest/trans": 49999991619.64198
    },
    "unreceived": true
}

* history

[
      {
        Height: 206,
        IsReceive: false,
        TimeStamp: 1627411856197,
        SendAccountId: 'LUTG2E1mdpGk5Qtq9BUgwZDWhUeZc14Xfw2pAvAdKoacvgRBU3atwtrQeoY3evm5C7TXRz3Q5nwPEUHj9p7CBDE6kQTQMy',
        SendHash: '3v8y5F7bKkE4JkFJ84pMjDUwTaEAWyucBiCG4NaQhA4c',
        RecvAccountId: 'LUTAq9MFf4vaqbEEDHsRj8SUbLWoKptndaUqXSnYbi7mC1cXajts6fWXhQUuwR4ZX7DnvERkUMpwXKf4XKk4NjVMxqYvmn',
        RecvHash: '6pkhSmjekm59LEfn2R4DEK8xz4jf7mbWN3ENbh5mvQ1z',
        Balances: {
          LYR: '4717212.04747006',
          'unittest/trans': '49999983764.82218702'
        }
      },
      {
        Height: 207,
        IsReceive: false,
        TimeStamp: 1627412050805,
        SendAccountId: 'LUTG2E1mdpGk5Qtq9BUgwZDWhUeZc14Xfw2pAvAdKoacvgRBU3atwtrQeoY3evm5C7TXRz3Q5nwPEUHj9p7CBDE6kQTQMy',
        SendHash: '74mTJ2JuuamukyGcgDiD4otaBwKbw8aLiKhPoTznVGLk',
        RecvAccountId: 'LUTAq9MFf4vaqbEEDHsRj8SUbLWoKptndaUqXSnYbi7mC1cXajts6fWXhQUuwR4ZX7DnvERkUMpwXKf4XKk4NjVMxqYvmn',
        RecvHash: 'GyKbpHX4VGtw4Sq2GGq88DvWZnqyY4sBwRrNB8qSp8sc',
        Changes: { LYR: '-2' },
        Balances: {
          LYR: '4717210.04747006',
          'unittest/trans': '49999983764.82218702'
        }
      },
      {
        Height: 208,
        IsReceive: false,
        TimeStamp: 1627413886778,
        SendAccountId: 'LUTG2E1mdpGk5Qtq9BUgwZDWhUeZc14Xfw2pAvAdKoacvgRBU3atwtrQeoY3evm5C7TXRz3Q5nwPEUHj9p7CBDE6kQTQMy',
        SendHash: 'B3FVLgCPLroa6WhsHDqFxrZLpPR16KaG6c6qK3fRhT9S',
        RecvAccountId: 'LUTAq9MFf4vaqbEEDHsRj8SUbLWoKptndaUqXSnYbi7mC1cXajts6fWXhQUuwR4ZX7DnvERkUMpwXKf4XKk4NjVMxqYvmn',
        RecvHash: '7dFFo3rxZcfdLZKgRTf4M9pgXswhJTXbYCfq581kusBh',
        Changes: { LYR: '-2' },
        Balances: {
          LYR: '4717208.04747006',
          'unittest/trans': '49999983764.82218702'
        }
      }
    ]

```

# Usage

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

# Security

Private key never leaves current client process. For safety, call close() immediately after send/receive.
