export function get5Grams(text: string): Set<string> {
    const cleaned = text.replace(/\s+/g, '').toLowerCase();
    const ngrams = new Set<string>();
    for (let i = 0; i <= cleaned.length - 5; i++) {
        ngrams.add(cleaned.substring(i, i + 5));
    }
    return ngrams;
}

export function jaccardSimilarity(text1: string, text2: string): number {
    const set1 = get5Grams(text1);
    const set2 = get5Grams(text2);
    
    let intersection = 0;
    for (const item of set1) {
        if (set2.has(item)) {
            intersection++;
        }
    }
    
    const union = set1.size + set2.size - intersection;
    if (union === 0) return 1;
    
    return intersection / union;
}
