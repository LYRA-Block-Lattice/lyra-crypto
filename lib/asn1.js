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
exports.convertDerToP1393 = exports.decodeASN1Sequence = void 0;
const bigintConversion = __importStar(require("bigint-conversion"));
function decodeASN1Sequence(encoded) {
    const integers = [];
    const buffer = new Uint8Array(Buffer.from(encoded, "hex"));
    // Find the ASN.1 sequence tag (0x30) at the beginning of the buffer
    let offset = 0;
    if (buffer[offset] !== 0x30) {
        throw new Error("Invalid ASN.1 sequence encoding");
    }
    // Move the offset past the sequence tag and length field
    offset += 2;
    // Decode each element in the sequence
    while (offset < buffer.length) {
        // Get the tag and length of the next element
        const tag = buffer[offset];
        offset++;
        const length = buffer[offset];
        offset++;
        // If the tag is for an INTEGER (0x02), decode the value and add it to the output array
        if (tag === 0x02) {
            const value = buffer.slice(offset, offset + length);
            const integer = bigintConversion.bufToBigint(value);
            integers.push(getBigIntAbsoluteValue(integer));
        }
        // Move the offset past the value of the current element
        offset += length;
    }
    return integers;
}
exports.decodeASN1Sequence = decodeASN1Sequence;
function bitLength(n) {
    // Convert the bigint to a string in binary format
    const binStr = n.toString(2);
    // Count the number of characters in the binary string
    return binStr.length;
}
function isBigIntNegative(x) {
    const zero = BigInt.asIntN(bitLength(x), 0n);
    return x < zero;
}
function getBigIntAbsoluteValue(x) {
    const negative = isBigIntNegative(x);
    if (negative) {
        // Compute the 2's complement of x, which is equivalent to negating x
        const twoComplement = ~x + 1n;
        // Convert the 2's complement to a non-negative BigInt using asUintN()
        return BigInt.asUintN(bitLength(x), twoComplement);
    }
    else {
        return x;
    }
}
function concatArrayBuffers(a, b) {
    // Create a new ArrayBuffer with a size equal to the combined length of a and b
    const result = new ArrayBuffer(a.byteLength + b.byteLength);
    // Copy the contents of a into the beginning of the new ArrayBuffer
    const resultView = new Uint8Array(result);
    resultView.set(new Uint8Array(a), 0);
    // Copy the contents of b after the contents of a
    resultView.set(new Uint8Array(b), a.byteLength);
    return result;
}
function convertDerToP1393(der) {
    const integers = decodeASN1Sequence(der);
    const r = integers[0];
    const s = integers[1];
    const rb = bigintConversion.bigintToBuf(r);
    const sb = bigintConversion.bigintToBuf(s);
    const buff = concatArrayBuffers(rb, sb);
    return Buffer.from(buff).toString("hex");
}
exports.convertDerToP1393 = convertDerToP1393;
// export function convertP1393ToDer(p1393: string): string {
//   const buffer = new Uint8Array(Buffer.from(p1393, "hex"));
//   const half = Math.floor(buffer.length / 2);
//   const rb = buffer.slice(0, half);
//   const sb = buffer.slice(half);
//   const r = bigintConversion.bufToBigint(rb);
//   const s = bigintConversion.bufToBigint(sb);
//   const der = asn1.encode(asn1.Sequence, [r, s]);
//   return Buffer.from(der).toString("hex");
// }
