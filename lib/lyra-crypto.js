"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyraCrypto = void 0;
var KJUR = require("jsrsasign");
var bs58 = require("bs58");
var LyraCrypto = /** @class */ (function () {
    function LyraCrypto() {
    }
    LyraCrypto.fromHexString = function (hexString) {
        var mt = hexString.match(/.{1,2}/g);
        if (mt !== null)
            return new Uint8Array(mt.map(function (byte) { return parseInt(byte, 16); }));
        else
            throw new Error("no match found.");
    };
    LyraCrypto.toHexString = function (bytes) {
        return bytes.reduce(function (str, byte) { return str + byte.toString(16).padStart(2, "0"); }, "");
    };
    LyraCrypto.concatTypedArrays = function (a, b) {
        // a, b TypedArray of same type
        var c = new Uint8Array(a.length + b.length);
        c.set(a, 0);
        c.set(b, a.length);
        return c;
    };
    LyraCrypto.sliceTypedArrays = function (a, offset, len) {
        // a, TypedArray, from offset with len
        return a.slice(offset, offset + len);
    };
    LyraCrypto.sha256 = function (hexString) {
        // SJCL(Stanford JavaScript Crypto Library) provider sample
        var md = new KJUR.crypto.MessageDigest({ alg: "sha256", prov: "sjcl" }); // sjcl supports sha256 only
        return md.digestHex(hexString);
    };
    LyraCrypto.checksum = function (data) {
        var hash1 = this.sha256(this.toHexString(data));
        var hash2 = this.sha256(hash1);
        var buff = hash2.substring(0, 8);
        return buff;
    };
    LyraCrypto.lyraEncPvt = function (hex) {
        return this.lyraEnc(hex);
    };
    LyraCrypto.lyraEncPub = function (hex) {
        var result = this.lyraEnc(hex.substring(2)); //'04', means 'not compressed'
        var tag = "L";
        return tag.concat(result);
    };
    LyraCrypto.lyraDecAccountId = function (accountId) {
        var pubKey = accountId.substring(1);
        var decStr = this.lyraDec(pubKey);
        if (decStr === undefined)
            return undefined;
        return "04" + decStr;
    };
    LyraCrypto.lyraEnc = function (hex) {
        var buff = this.fromHexString(hex);
        var crc = this.checksum(buff);
        var crcBuff = this.fromHexString(crc);
        var buff2 = this.concatTypedArrays(buff, crcBuff);
        return bs58.encode(Buffer.from(buff2));
    };
    LyraCrypto.lyraDec = function (pvtKey) {
        var dec = bs58.decode(pvtKey);
        // var buff = this.toUTF8Array(dec);
        var buff = dec;
        var data = this.sliceTypedArrays(buff, 0, buff.byteLength - 4);
        var checkbytes = this.sliceTypedArrays(buff, buff.byteLength - 4, 4);
        var check = this.toHexString(checkbytes);
        var check2 = this.checksum(data);
        if (check.localeCompare(check2) === 0) {
            return this.toHexString(data);
        }
        else {
            return undefined;
        }
    };
    LyraCrypto.isAccountIdValid = function (accountId) {
        if (accountId.length < 10 || accountId.substring(0, 1) !== "L")
            return false;
        var decStr = this.lyraDecAccountId(accountId);
        return decStr !== undefined;
    };
    LyraCrypto.isPrivateKeyValid = function (privateKey) {
        return undefined !== this.lyraDec(privateKey);
    };
    LyraCrypto.GenerateWallet = function () {
        var ec = new KJUR.crypto.ECDSA({ curve: "secp256r1" });
        var keypair = ec.generateKeyPairHex();
        var pvtHex = keypair.ecprvhex;
        var prvKey = LyraCrypto.lyraEncPvt(pvtHex);
        var actId = LyraCrypto.lyraEncPub(LyraCrypto.prvToPub(pvtHex));
        return { privateKey: prvKey, accountId: actId };
    };
    LyraCrypto.Sign = function (msg, privateKey) {
        var prvkey = this.lyraDec(privateKey);
        var sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
        sig.init({ d: prvkey, curve: "secp256r1" });
        var buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        var sigValueHex = sig.sign();
        return sigValueHex;
    };
    LyraCrypto.Verify = function (msg, accountId, sigval) {
        var sig = new KJUR.crypto.Signature({
            alg: "SHA256withECDSA"
        });
        var pubkey = this.lyraDecAccountId(accountId);
        sig.init({ xy: pubkey, curve: "secp256r1" });
        var buff = this.toHexString(this.toUTF8Array(msg));
        sig.updateHex(buff);
        return sig.verify(sigval);
    };
    LyraCrypto.GetAccountIdFromPrivateKey = function (privateKey) {
        var pvkDec = LyraCrypto.lyraDec(privateKey);
        if (pvkDec === undefined) {
            console.log("not lyra private key");
            return undefined;
        }
        var pubkey = LyraCrypto.prvToPub(pvkDec);
        var resp = LyraCrypto.lyraEncPub(pubkey);
        return resp;
    };
    LyraCrypto.prvToPub = function (prvkey) {
        var sig = new KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
        sig.init({ d: prvkey, curve: "secp256r1" });
        var biPrv = new KJUR.BigInteger(prvkey, 16);
        var pvv = sig.prvKey;
        var g = pvv.ecparams.G;
        var epPub = g.multiply(biPrv);
        var biX = epPub.getX().toBigInteger();
        var biY = epPub.getY().toBigInteger();
        var charlen = pvv.ecparams.keylen / 4;
        var hX = ("0000000000" + biX.toString(16)).slice(-charlen);
        var hY = ("0000000000" + biY.toString(16)).slice(-charlen);
        var hPub = "04" + hX + hY;
        return hPub;
    };
    LyraCrypto.toUTF8Array = function (str) {
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
    };
    return LyraCrypto;
}());
exports.LyraCrypto = LyraCrypto;
