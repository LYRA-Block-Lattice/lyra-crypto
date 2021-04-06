/* globals describe, expect, test */
import LyraCrypto from "../src/crypto";

describe("test private key to public key", (): void => {
  test("wallet 1", (): void => {
    const pvk = "2gbESTeBHsgt8um1aNN2dC9jajEDk3CoEupwmN6TRJQckyRbHa";
    const pub =
      "LUTkgGP9tb4iAFAFXv7i83N4GreEUakWbaDrUbUFnKHpPp46n9KF1QzCtvUwZRBCQz6yqerkWvvGXtCTkz4knzeKRmqid";
    const pvkDec: string | undefined = LyraCrypto.lyraDec(pvk);
    if (pvkDec === undefined) {
      fail("not lyra private key");
      return;
    }
    const pubkey: string = LyraCrypto.prvToPub(pvkDec);
    const resp: string = LyraCrypto.lyraEncPub(pubkey);
    expect(resp).toBe(pub);
  });
});
