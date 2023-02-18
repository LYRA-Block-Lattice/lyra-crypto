/* globals describe, expect, test */
import { LyraCrypto } from "../src/lyra-crypto";
import { LyraApi } from "../src/lyra-api";

require("dotenv").config();

jest.setTimeout(60000);

const network = process.env.REACT_APP_NETWORK_ID!;
console.log("network: " + network);

describe("Lyra Crypto Library Test", (): void => {
  test("key validate", (): void => {
    const pvk = "2gbESTeBHsgt8um1aNN2dC9jajEDk3CoEupwmN6TRJQckyRbHa";
    const pub =
      "LUTkgGP9tb4iAFAFXv7i83N4GreEUakWbaDrUbUFnKHpPp46n9KF1QzCtvUwZRBCQz6yqerkWvvGXtCTkz4knzeKRmqid";

    expect(LyraCrypto.isPrivateKeyValid(pvk)).toBe(true);
    expect(LyraCrypto.isAccountIdValid(pub)).toBe(true);

    const pvk2 = "2fbESTeBHsgt8um1aNN2dC9jajEDk3CoEupwmN6TRJQckyRbHa";
    const pub2 =
      "LUTkfGP9tb4iAFAFXv7i83N4GreEUakWbaDrUbUFnKHpPp46n9KF1QzCtvUwZRBCQz6yqerkWvvGXtCTkz4knzeKRmqid";

    expect(LyraCrypto.isPrivateKeyValid(pvk2)).toBe(false);
    expect(LyraCrypto.isAccountIdValid(pub2)).toBe(false);
  });

  test("wallet 1", (): void => {
    const pvk = "2gbESTeBHsgt8um1aNN2dC9jajEDk3CoEupwmN6TRJQckyRbHa";
    const pub =
      "LUTkgGP9tb4iAFAFXv7i83N4GreEUakWbaDrUbUFnKHpPp46n9KF1QzCtvUwZRBCQz6yqerkWvvGXtCTkz4knzeKRmqid";
    const resp: string | undefined = LyraCrypto.GetAccountIdFromPrivateKey(pvk);
    if (resp === undefined) {
      fail("not lyra private key");
      return;
    }
    expect(resp).toBe(pub);
  });

  test("wallet 2", (): void => {
    const { privateKey, accountId } = LyraCrypto.GenerateWallet();
    const resp: string | undefined =
      LyraCrypto.GetAccountIdFromPrivateKey(privateKey);
    if (resp === undefined) {
      fail("not lyra private key");
      return;
    }
    expect(resp).toBe(accountId);
  });

  test("Sign & Verify", (): void => {
    const pvk = "2gbESTeBHsgt8um1aNN2dC9jajEDk3CoEupwmN6TRJQckyRbHa";
    const pub =
      "LUTkgGP9tb4iAFAFXv7i83N4GreEUakWbaDrUbUFnKHpPp46n9KF1QzCtvUwZRBCQz6yqerkWvvGXtCTkz4knzeKRmqid";
    const msg = "aaa";
    const signature = LyraCrypto.Sign(msg, pvk);
    const result = LyraCrypto.Verify(msg, pub, signature);
    expect(result).toBe(true);
  });

  it("works with get balance", async () => {
    const pvk = "2iWkVkodnhcvQvzQSnBKMU3PhMfhEfWVMRWC1S21qg4cNR9UxC"; // test 3
    // public address: LUTnKnTaeZ95MaCCeA4Y7RZeLo5PrmAipuvaaHMvrpk3awbc7VBSWNRRuhQuA5qy5SGNh7imC71jaMCdttMN1a6DrSPTP6
    const wallet = new LyraApi(network, pvk);
    await wallet.init();
    const result = await wallet.balance();
    expect(result).toBeDefined();
    expect(result?.balance["LYR"]).toBeGreaterThan(10000);
  });

  it("works with send", async () => {
    const pvk = "2iWkVkodnhcvQvzQSnBKMU3PhMfhEfWVMRWC1S21qg4cNR9UxC";
    const dst =
      "LUT5jYomQHCJQhG3Co7GadEtohpwwYtyYz1vABHGeDkLDpSJGXFfpYgD9XckRXQg2Hv2Yrb2Ade3jbecZpLf4hbVho6b5n"; // test 4
    const wallet = new LyraApi(network, pvk);
    await wallet.init();
    const result = await wallet.balance();
    expect(result).toBeDefined();

    const result2 = await wallet.send(1, dst, "LYR");
    expect(result2.resultCode).toBe(0);
    expect(result2.resultMessage).toBe("Success");
    //var delta = result!.balance["LYR"] - result2.balance["LYR"];
    //expect(delta).toEqual(2);
  });

  it("works with send & receive", async () => {
    const pvk = "dkrwRdqNjEEshpLuEPPqc6zM1HM3nzGjsYts39zzA1iUypcpj";
    const pvk2 = "Hc3XcZgZ1d2jRxhNojN1gnKHv5SBs15mR8K2SdkBbycrgAjPr";
    const dst =
      "LUTAq9MFf4vaqbEEDHsRj8SUbLWoKptndaUqXSnYbi7mC1cXajts6fWXhQUuwR4ZX7DnvERkUMpwXKf4XKk4NjVMxqYvmn";
    const wallet = new LyraApi(network, pvk);
    await wallet.init();
    // const result = await wallet.balance();
    // expect(result).toBeDefined();

    // const wallet2 = new LyraApi(network, pvk2);
    // await wallet2.init();
    // const result5 = await wallet2.receive(); // remove pending unreceive
    // expect(result5).toBeDefined();

    // const result2 = await wallet.send(1, dst, "LYR");
    // expect(result2).toBeDefined();

    // var delta = result.balance["LYR"] - result2.balance["LYR"];
    // expect(delta).toEqual(2);

    // const result6 = await wallet2.receive();
    // expect(result6).toBeDefined();
    // var delta2 = result6.balance["LYR"] - result5.balance["LYR"];
    // console.log("delta2 is ", delta2);
    // expect(delta2).toEqual(1);

    // var dtStart = new Date(Date.now());
    // dtStart.setDate(dtStart.getDate() - 1);
    // var hist = await wallet.history(dtStart, new Date(Date.now()), 10);
    // expect(hist).toBeDefined();
    // console.log("hist is ", hist);
  });
});
