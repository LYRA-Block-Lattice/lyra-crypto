import * as bigintConversion from "bigint-conversion";

export function decodeASN1Sequence(encoded: string): bigint[] {
  const integers: bigint[] = [];
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

function bitLength(n: bigint): number {
  // Convert the bigint to a string in binary format
  const binStr = n.toString(2);

  // Count the number of characters in the binary string
  return binStr.length;
}

function isBigIntNegative(x: bigint): boolean {
  const zero = BigInt.asIntN(bitLength(x), 0n);
  return x < zero;
}

function getBigIntAbsoluteValue(x: bigint): bigint {
  const negative = isBigIntNegative(x);
  if (negative) {
    // Compute the 2's complement of x, which is equivalent to negating x
    const twoComplement = ~x + 1n;

    // Convert the 2's complement to a non-negative BigInt using asUintN()
    return BigInt.asUintN(bitLength(x), twoComplement);
  } else {
    return x;
  }
}

function concatArrayBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer {
  // Create a new ArrayBuffer with a size equal to the combined length of a and b
  const result = new ArrayBuffer(a.byteLength + b.byteLength);

  // Copy the contents of a into the beginning of the new ArrayBuffer
  const resultView = new Uint8Array(result);
  resultView.set(new Uint8Array(a), 0);

  // Copy the contents of b after the contents of a
  resultView.set(new Uint8Array(b), a.byteLength);

  return result;
}

export function convertDerToP1393(der: string): string {
  const integers = decodeASN1Sequence(der);
  const r = integers[0];
  const s = integers[1];

  const rb = bigintConversion.bigintToBuf(r);
  const sb = bigintConversion.bigintToBuf(s);

  const buff = concatArrayBuffers(rb, sb);

  return Buffer.from(buff).toString("hex");
}

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
