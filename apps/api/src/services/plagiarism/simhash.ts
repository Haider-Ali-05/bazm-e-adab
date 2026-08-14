import * as crypto from 'crypto';

export function getNgrams(text: string, n: number = 3): string[] {
    const cleaned = text.replace(/\s+/g, '').toLowerCase();
    const ngrams = [];
    for (let i = 0; i <= cleaned.length - n; i++) {
        ngrams.push(cleaned.substring(i, i + n));
    }
    return ngrams;
}

export function hashToBigInt(str: string): bigint {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    return BigInt('0x' + hash.substring(0, 16));
}

export function computeSimhash(text: string): bigint {
    const ngrams = getNgrams(text, 3);
    const v = new Array(64).fill(0);
    
    for (const ngram of ngrams) {
        const hash = hashToBigInt(ngram);
        for (let i = 0n; i < 64n; i++) {
            const bit = (hash >> i) & 1n;
            if (bit === 1n) {
                v[Number(i)] += 1;
            } else {
                v[Number(i)] -= 1;
            }
        }
    }
    
    let fingerprint = 0n;
    for (let i = 0n; i < 64n; i++) {
        if (v[Number(i)] > 0) {
            fingerprint |= (1n << i);
        }
    }
    
    return fingerprint;
}

export function hammingDistance(hash1: bigint, hash2: bigint): number {
    let xor = hash1 ^ hash2;
    let distance = 0;
    while (xor > 0n) {
        distance += Number(xor & 1n);
        xor >>= 1n;
    }
    return distance;
}
