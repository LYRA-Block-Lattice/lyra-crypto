# lyra-crypto
Javascript library to do crypto for Lyra blockchain.

```
declare class LyraCrypto {
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
export default LyraCrypto;

```
