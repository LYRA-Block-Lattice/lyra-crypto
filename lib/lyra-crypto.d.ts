export declare class LyraCrypto {
    private static fromHexString;
    private static toHexString;
    private static concatTypedArrays;
    private static sliceTypedArrays;
    private static sha256;
    private static checksum;
    private static lyraEncPvt;
    private static lyraEncPub;
    private static lyraDecAccountId;
    private static lyraEnc;
    private static lyraDec;
    static isAccountIdValid(accountId: string): boolean;
    static isPrivateKeyValid(privateKey: string): boolean;
    static GenerateWallet(): {
        privateKey: any;
        accountId: string;
    };
    static Sign(msg: string, privateKey: string): any;
    static Verify(msg: string, accountId: string, sigval: string): any;
    static GetAccountIdFromPrivateKey(privateKey: string): string | undefined;
    private static prvToPub;
    private static toUTF8Array;
}
