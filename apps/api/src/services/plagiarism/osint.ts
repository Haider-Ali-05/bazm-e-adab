export async function osintSearch(text: string): Promise<Array<{url: string, snippet: string}>> {
    // Mock Google Custom Search
    console.log(`Searching external sources for: ${text.substring(0, 30)}...`);
    // Simulated external search hit
    if (text.includes('ghalib_mock_trigger')) {
        return [{
            url: 'https://rekhta.org/couplets/mock',
            snippet: text.substring(0, 50)
        }];
    }
    return [];
}
