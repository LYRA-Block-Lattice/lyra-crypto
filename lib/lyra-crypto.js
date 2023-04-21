"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraCrypto = void 0;
// change require to import
var KJUR = require("jsrsasign");
const bs58 = __importStar(require("bs58"));
const web_encoding_1 = require("web-encoding");
const asn1_1 = require("./asn1");
const asn1lib = __importStar(require("asn1js"));
class LyraCrypto {
    static fromHexString(hexString) {
        var mt = hexString.match(/.{1,2}/g);
        if (mt !== null)
            return new Uint8Array(mt.map((byte) => parseInt(byte, 16)));
        else
            throw new Error("no match found.");
    }
    static toHexString(bytes) {
        return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    }
    static concatTypedArrays(a, b) {
        // a, b TypedArray of same type
        const c = new Uint8Array(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    }
    static sliceTypedArrays(a, offset, len) {
        // a, TypedArray, from offset with len
        return a.slice(offset, offset + len);
    }
    static checksum(data) {
        const hash1 = this.sha256(this.toHexString(data));
        const hash2 = this.sha256(hash1);
        const buff = hash2.substring(0, 8);
        return buff;
    }
    static lyraEncPvt(hex) {
        return this.lyraEnc(hex);
    }
    static lyraEncPub(hex) {
        const result = this.lyraEnc(hex.substring(2)); //'04', means 'not compressed'
        const tag = "L";
        return tag.concat(result);
    }
    static lyraDecAccountId(accountId) {
        const pubKey = accountId.substring(1);
        const decStr = this.lyraDec(pubKey);
        if (decStr === undefined)
            return undefined;
        return "04" + decStr;
    }
    static lyraEnc(hex) {
        const buff = this.fromHexString(hex);
        const crc = this.checksum(buff);
        const crcBuff = this.fromHexString(crc);
        const buff2 = this.concatTypedArrays(buff, crcBuff);
        // return base58 encode of buff2
        return bs58.encode(buff2);
    }
    static lyraDec(pvtKey) {
        const dec = bs58.decode(pvtKey);
        // var buff = this.toUTF8Array(dec);
        const buff = dec;
        const data = this.sliceTypedArrays(buff, 0, buff.byteLength - 4);
        const checkbytes = this.sliceTypedArrays(buff, buff.byteLength - 4, 4);
        const check = this.toHexString(checkbytes);
        const check2 = this.checksum(data);
        if (check.localeCompare(check2) === 0) {
            return this.toHexString(data);
        }
        else {
            return undefined;
        }
    }
    // input: hex string, output: hex string
    static sha256(hexString) {
        // SJCL(Stanford JavaScript Crypto Library) provider sample
        const md = new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "sjcl" }); // sjcl supports sha256 only
        return md.digestHex(hexString);
    }
    // code by chatgpt
    static async sha256alt(input) {
        const encoder = new web_encoding_1.TextEncoder();
        const data = encoder.encode(input);
        const hash = await KJUR.crypto.subtle.digest("SHA-256", data);
        return bs58.encode(new Uint8Array(hash));
        // return Array.from(new Uint8Array(hash))
        //   .map((b) => b.toString(16).padStart(2, "0"))
        //   .join("");
    }
    static stringToUnicodeByteArray(str) {
        const encoder = new web_encoding_1.TextEncoder();
        const utf8Array = encoder.encode(str);
        const byteArray = new Uint8Array(utf8Array.length * 2);
        for (let i = 0; i < utf8Array.length; i++) {
            byteArray[i * 2] = utf8Array[i];
            byteArray[i * 2 + 1] = 0;
        }
        return byteArray;
    }
    static stringToUnicode(str) {
        let unicode = "";
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const hexCode = charCode.toString(16).toUpperCase();
            const paddedHexCode = hexCode.padStart(4, "0");
            unicode += `\\u${paddedHexCode}`;
        }
        return unicode;
    }
    static stringToHex(str) {
        let hex = "";
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const hexCode = charCode.toString(16).toUpperCase();
            hex += hexCode;
            hex += "00";
        }
        return hex;
    }
    static Hash(msg) {
        //const unicode = this.stringToUnicode(msg);
        const unibin = this.stringToUnicodeByteArray(msg);
        const unihex = this.toHexString(unibin);
        //console.log("unihex: " + unihex);
        const hashHex = this.sha256(unihex);
        const buff = this.fromHexString(hashHex);
        return bs58.encode(buff);
        // const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
        // const hashArray = Array.from(new Uint8Array(hashBuffer));
        // const hashHex = hashArray
        //   .map((bytes) => bytes.toString(16).padStart(2, "0"))
        //   .join("");
        // const buff = this.fromHexString(hashHex);
        // return bs58.encode(buff);
    }
    // static convertDerToP1393(bcSignature: Uint8Array): Uint8Array {
    //   const asn1 = asn1lib.fromBER(bcSignature.buffer);
    //   console.log("asn1: ", asn1);
    //   const bcDerSequence = asn1.result as asn1lib.Sequence;
    //   console.log("bcDerSequence: ", bcDerSequence);
    //   const bcR = bcDerSequence.valueBlock.value[0] as asn1lib.Integer;
    //   console.log("bcR: ", bcR);
    //   const bcS = bcDerSequence.valueBlock.value[1] as asn1lib.Integer;
    //   console.log("bcS: ", bcS);
    //   const buff = new Uint8Array(
    //     bcR.valueBlock.valueHexView.length + bcS.valueBlock.valueHexView.length
    //   );
    //   buff.set(bcR.valueBlock.valueHexView, 0);
    //   buff.set(bcS.valueBlock.valueHexView, bcR.valueBlock.valueHexView.length);
    //   return buff;
    // }
    static convertP1393ToDer(signature) {
        const r = signature.slice(0, signature.length / 2);
        const s = signature.slice(signature.length / 2);
        var sequence2 = new asn1lib.Sequence({
            value: [
                new asn1lib.Integer({ isHexOnly: true, valueHex: r }),
                new asn1lib.Integer({
                    isHexOnly: true,
                    valueHex: s
                })
            ]
        });
        const buff = sequence2.toBER();
        return new Uint8Array(buff);
    }
    static isAccountIdValid(accountId) {
        if (accountId.length < 10 || accountId.substring(0, 1) !== "L")
            return false;
        const decStr = this.lyraDecAccountId(accountId);
        return decStr !== undefined;
    }
    static isPrivateKeyValid(privateKey) {
        return undefined !== this.lyraDec(privateKey);
    }
    static GenerateWallet() {
        const ec = new KJUR.crypto.ECDSA({ curve: "secp256r1" });
        const keypair = ec.generateKeyPairHex();
        var pvtHex = keypair.ecprvhex;
        var prvKey = LyraCrypto.lyraEncPvt(pvtHex);
        var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvtHex));
        return { privateKey: prvKey, accountId: actId };
    }
    static Sign(msg, privateKey) {
        const prvkey = this.lyraDec(privateKey);
        const sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
        sig.init({ d: prvkey, curve: "secp256r1" });
        const buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        const sigValueHex = sig.sign();
        //return sigValueHex;
        // test convert to P1393 and back
        const sig2 = (0, asn1_1.convertDerToP1393)(sigValueHex);
        // convert to P1393
        const sigbuff = this.fromHexString(sig2);
        //const sigbuff2 = this.convertDerToP1393(sigbuff);
        // test
        //const sigbuff3 = this.convertP1393ToDer(sigbuff);
        //const sigbuff3x = this.fromHexString(sigValueHex);
        //console.log("sigbuff3: ", sigbuff3);
        //console.log("sigbuff3x: ", sigbuff3x);
        return bs58.encode(sigbuff);
    }
    // static Sign2(msg: string, privateKey: string) {
    //   const signstr = this.Sign(msg, privateKey);
    //   const signbuff = this.fromHexString(signstr);
    //   const signbuff2 = convertDerToP1393(signbuff);
    //   return bs58.encode(signbuff2);
    // }
    static Verify(msg, accountId, sigval) {
        const sigbuff = bs58.decode(sigval);
        const sigder = this.convertP1393ToDer(sigbuff);
        const signstr = this.toHexString(sigder);
        const sig = new KJUR.crypto.Signature({
            alg: "SHA256withECDSA"
        });
        const pubkey = this.lyraDecAccountId(accountId);
        sig.init({ xy: pubkey, curve: "secp256r1" });
        const buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        return sig.verify(signstr);
    }
    static GetAccountIdFromPrivateKey(privateKey) {
        const pvkDec = LyraCrypto.lyraDec(privateKey);
        if (pvkDec === undefined) {
            console.log("not lyra private key");
            return undefined;
        }
        const pubkey = LyraCrypto.prvToPub(pvkDec);
        const resp = LyraCrypto.lyraEncPub(pubkey);
        return resp;
    }
    static prvToPub(prvkey) {
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
    static toUTF8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80)
                utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode =
                    0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return Uint8Array.from(utf8);
    }
}
exports.LyraCrypto = LyraCrypto;
