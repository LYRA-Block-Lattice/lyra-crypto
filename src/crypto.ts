const KJUR = require("jsrsasign");
const bs58 = require("bs58");
const CryptoJs = require("crypto-js");
//const utf8 = require("utf8");

class LyraCrypto {
  static fromHexString(hexString: string) {
    var mt = hexString.match(/.{1,2}/g);
    if (mt !== null)
      return new Uint8Array(mt.map((byte) => parseInt(byte, 16)));
    else throw new Error("no match found.");
  }

  static toHexString(bytes: Uint8Array) {
    return bytes.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, "0"),
      ""
    );
  }

  static concatTypedArrays(a: Uint8Array, b: Uint8Array) {
    // a, b TypedArray of same type
    const c = new Uint8Array(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

  static sliceTypedArrays(a: Uint8Array, offset: number, len: number) {
    // a, TypedArray, from offset with len
    return a.slice(offset, offset + len);
  }

  static sha256(hexString: string) {
    // SJCL(Stanford JavaScript Crypto Library) provider sample
    const md = new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "sjcl" }); // sjcl supports sha256 only
    return md.digestHex(hexString);
  }

  static checksum(data: Uint8Array) {
    const hash1 = this.sha256(this.toHexString(data));
    const hash2 = this.sha256(hash1);
    const buff = hash2.substring(0, 8);
    return buff;
  }

  static lyraEncPvt(hex: string) {
    return this.lyraEnc(hex);
  }

  static lyraEncPub(hex: string) {
    const result = this.lyraEnc(hex.substring(2));
    const tag = "L";
    return tag.concat(result);
  }

  static lyraEnc(hex: string) {
    const buff = this.fromHexString(hex);
    const crc = this.checksum(buff);
    const crcBuff = this.fromHexString(crc);
    const buff2 = this.concatTypedArrays(buff, crcBuff);
    return bs58.encode(Buffer.from(buff2));
  }

  static lyraDec(pvtKey: string) {
    const dec = bs58.decode(pvtKey);
    // var buff = this.toUTF8Array(dec);
    const buff = dec;
    const data = this.sliceTypedArrays(buff, 0, buff.byteLength - 4);
    const checkbytes = this.sliceTypedArrays(buff, buff.byteLength - 4, 4);
    const check = this.toHexString(checkbytes);

    const check2 = this.checksum(data);
    if (check.localeCompare(check2) === 0) {
      return this.toHexString(data);
    } else {
      return undefined;
    }
  }

  static encrypt(s: string, password: string) {
    return CryptoJs.AES.encrypt(s, password).toString();
  }

  static decrypt(s: string, password: string) {
    const bytes = CryptoJs.AES.decrypt(s, password);
    return bytes.toString(CryptoJs.enc.Utf8);
  }

  static lyraGenWallet() {
    const ec = new KJUR.crypto.ECDSA({ curve: "secp256r1" });
    const keypair = ec.generateKeyPairHex();
    return keypair.ecprvhex;
  }

  static lyraSign(msg: string, prvkey: string) {
    const sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
    sig.init({ d: prvkey, curve: "secp256r1" });
    const buff = this.toHexString(this.toUTF8Array(msg));
    sig.updateHex(buff);
    const sigValueHex = sig.sign();
    return sigValueHex;
  }

  static lyraVerify(msg: string, pubkey: string, sigval: string) {
    const sig = new KJUR.crypto.Signature({
      alg: "SHA256withECDSA",
      prov: "cryptojs/jsrsa"
    });
    sig.init({ xy: pubkey, curve: "secp256r1" });
    const buff = this.toHexString(this.toUTF8Array(msg));
    sig.updateHex(buff);
    return sig.verify(sigval);
  }

  static prvToPub(prvkey: string) {
    const sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
    sig.init({ d: prvkey, curve: "secp256r1" });
    const biPrv = new KJUR.BigInteger(prvkey, 16);
    const pvv = sig.prvKey;
    const g = pvv.ecparams.G;
    const epPub = g.multiply(biPrv);
    const biX = epPub.getX().toBigInteger();
    const biY = epPub.getY().toBigInteger();

    const charlen = pvv.ecparams.keylen / 4;
    const hX = ("0000000000" + biX.toString(16)).slice(-charlen);
    const hY = ("0000000000" + biY.toString(16)).slice(-charlen);
    const hPub = "04" + hX + hY;
    return hPub;
  }

  static toUTF8Array(str: string) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
      // surrogate pair
      else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode =
          0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        utf8.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
    }
    return Uint8Array.from(utf8);
  }
}

export default LyraCrypto;
