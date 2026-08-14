import { MeiliSearch } from 'meilisearch';
import dotenv from 'dotenv';

dotenv.config();

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY,
});

export class SearchService {
  async initIndex() {
    const index = client.index('poems');
    await index.updateSettings({
      searchableAttributes: ['title', 'body', 'body_normalized', 'tags'],
      filterableAttributes: ['genre', 'script_type', 'author_id', 'status'],
      sortableAttributes: ['created_at', 'like_count'],
      rankingRules: [
        'words', 'typo', 'proximity', 'attribute', 'sort', 'exactness', 'like_count:desc'
      ],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 }
      }
    });
  }

  async syncPoem(poem: any) {
    await client.index('poems').addDocuments([{
      id: poem.id,
      title: poem.title,
      body: poem.body,
      body_normalized: poem.body_normalized,
      genre: poem.genre,
      script_type: poem.script_type,
      tags: poem.tags,
      author_id: poem.author_id,
      status: poem.status,
      like_count: poem.like_count || 0,
      created_at: new Date(poem.created_at).getTime()
    }]);
  }

  async deletePoem(id: string) {
    await client.index('poems').deleteDocument(id);
  }

  async search(query: string, filters: { genre?: string; scriptType?: string; poet?: string }, limit: number = 20, offset: number = 0) {
    const filterArray: string[] = ["status = 'published'"];
    if (filters.genre) filterArray.push(`genre = ${filters.genre}`);
    if (filters.scriptType) filterArray.push(`script_type = ${filters.scriptType}`);
    if (filters.poet) filterArray.push(`author_id = ${filters.poet}`);

    const result = await client.index('poems').search(query, {
      filter: filterArray,
      limit,
      offset
    });
    return result;
  }
}
