/* globals describe, expect, test */
import LyraCrypto from "../src/crypto";

describe("test private key to public key", (): void => {
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
    const resp: string | undefined = LyraCrypto.GetAccountIdFromPrivateKey(
      privateKey
    );
    if (resp === undefined) {
      fail("not lyra private key");
      return;
    }
    expect(resp).toBe(accountId);
  });
});
