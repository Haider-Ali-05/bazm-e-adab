import { computeSimhash, hammingDistance } from './simhash';
import { jaccardSimilarity } from './jaccard';
import { osintSearch } from './osint';

// Mock DB context
const mockDb = [
    { id: 1, text: 'This is a test poem in urdu', simhash: computeSimhash('This is a test poem in urdu') }
];

export async function runPlagiarismEngine(poemText: string): Promise<any> {
    const targetSimhash = computeSimhash(poemText);
    
    // Layer 1: Simhash (Fast check against all poems)
    const candidates = [];
    for (const poem of mockDb) {
        const dist = hammingDistance(targetSimhash, poem.simhash);
        if (dist < 15) { // Similarity threshold for 64-bit hash
            candidates.push(poem);
        }
    }
    
    // Layer 2: Jaccard (Detailed 5-gram check on candidates)
    let highestSimilarity = 0;
    let closestInternalMatch = null;
    for (const cand of candidates) {
        const sim = jaccardSimilarity(poemText, cand.text);
        if (sim > highestSimilarity) {
            highestSimilarity = sim;
            closestInternalMatch = cand;
        }
    }
    
    // Layer 3: OSINT (Check the web for external matches)
    const externalMatches = await osintSearch(poemText);
    
    const isPlagiarized = highestSimilarity > 0.4 || externalMatches.length > 0;
    
    return {
        isPlagiarized,
        simhash: targetSimhash.toString(),
        internalMatches: closestInternalMatch ? { id: closestInternalMatch.id, similarity: highestSimilarity } : null,
        externalMatches
    };
}
