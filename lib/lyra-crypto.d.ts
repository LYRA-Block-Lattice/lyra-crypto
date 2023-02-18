export declare class LyraCrypto {
    private static fromHexString;
    private static toHexString;
    private static concatTypedArrays;
    private static sliceTypedArrays;
    private static checksum;
    private static lyraEncPvt;
    private static lyraEncPub;
    private static lyraDecAccountId;
    private static lyraEnc;
    private static lyraDec;
    static sha256(hexString: string): any;
    static sha256alt(input: string): Promise<string>;
    static stringToUnicodeByteArray(str: string): Uint8Array;
    static stringToUnicode(str: string): string;
    static stringToHex(str: string): string;
    static Hash(msg: string): string;
    static convertP1393ToDer(signature: Uint8Array): Uint8Array;
    static isAccountIdValid(accountId: string): boolean;
    static isPrivateKeyValid(privateKey: string): boolean;
    static GenerateWallet(): {
        privateKey: string;
        accountId: string;
    };
    static Sign(msg: string, privateKey: string): string;
    static Verify(msg: string, accountId: string, sigval: string): any;
    static GetAccountIdFromPrivateKey(privateKey: string): string | undefined;
    private static prvToPub;
    private static toUTF8Array;
}
