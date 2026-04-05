/**
 * Search Engine
 * Unified search across all domain entities in the Commercial Control Tower.
 * Searches matters, contracts, clients, vendors, obligations, invoices,
 * decision threads, and voice session transcripts.
 */

export type SearchableEntityType =
  | 'matter'
  | 'contract'
  | 'client'
  | 'vendor'
  | 'obligation'
  | 'invoice'
  | 'decision_thread'
  | 'voice_transcript'
  | 'note';

export interface SearchQuery {
  text: string;
  entity_types?: SearchableEntityType[];
  filters?: SearchFilter[];
  sort_by?: 'relevance' | 'date' | 'name';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
  value: unknown;
}

export interface SearchResult {
  entity_id: string;
  entity_type: SearchableEntityType;
  title: string;
  snippet: string;
  relevance_score: number;
  matched_fields: string[];
  metadata: Record<string, unknown>;
}

export interface SearchResponse {
  query: SearchQuery;
  results: SearchResult[];
  total_count: number;
  returned_count: number;
  searched_at: string;
  duration_ms: number;
}

/**
 * Indexed field definitions per entity type.
 */
const INDEXED_FIELDS: Record<SearchableEntityType, string[]> = {
  matter: ['title', 'description', 'status', 'client_name', 'matter_type', 'tags'],
  contract: ['title', 'contract_type', 'parties', 'status', 'governing_law', 'terms_summary'],
  client: ['name', 'contact_email', 'industry', 'tags'],
  vendor: ['name', 'contact_email', 'service_type', 'tags'],
  obligation: ['description', 'status', 'obligation_type', 'due_date', 'contract_title'],
  invoice: ['invoice_number', 'vendor_name', 'status', 'description', 'line_items'],
  decision_thread: ['title', 'status', 'participants', 'summary', 'rationale'],
  voice_transcript: ['transcript_text', 'session_type', 'participants', 'extracted_actions'],
  note: ['title', 'body', 'tags', 'related_entity'],
};

export class SearchEngine {
  private entityStores: Map<SearchableEntityType, Map<string, Record<string, unknown>>>;

  constructor() {
    this.entityStores = new Map();
    for (const entityType of Object.keys(INDEXED_FIELDS) as SearchableEntityType[]) {
      this.entityStores.set(entityType, new Map());
    }
  }

  /**
   * Index an entity for search.
   */
  index(entityType: SearchableEntityType, entityId: string, data: Record<string, unknown>): void {
    const store = this.entityStores.get(entityType);
    if (store) {
      store.set(entityId, data);
    }
  }

  /**
   * Remove an entity from the search index.
   */
  deindex(entityType: SearchableEntityType, entityId: string): void {
    const store = this.entityStores.get(entityType);
    if (store) {
      store.delete(entityId);
    }
  }

  /**
   * Execute a search query across indexed entities.
   */
  search(query: SearchQuery): SearchResponse {
    const startTime = Date.now();
    const targetTypes = query.entity_types || (Object.keys(INDEXED_FIELDS) as SearchableEntityType[]);
    const allResults: SearchResult[] = [];
    const searchTerms = query.text.toLowerCase().split(/\s+/).filter(Boolean);

    for (const entityType of targetTypes) {
      const store = this.entityStores.get(entityType);
      if (!store) continue;

      const fields = INDEXED_FIELDS[entityType] || [];

      for (const [entityId, data] of store.entries()) {
        const matchResult = this.scoreEntity(searchTerms, data, fields);
        if (matchResult.score > 0) {
          if (query.filters && !this.passesFilters(data, query.filters)) continue;

          allResults.push({
            entity_id: entityId,
            entity_type: entityType,
            title: String(data['title'] || data['name'] || entityId),
            snippet: this.generateSnippet(searchTerms, data, fields),
            relevance_score: matchResult.score,
            matched_fields: matchResult.matched_fields,
            metadata: { status: data['status'], date: data['created_at'] || data['date'] },
          });
        }
      }
    }

    // Sort
    const sortBy = query.sort_by || 'relevance';
    allResults.sort((a, b) => {
      if (sortBy === 'relevance') return b.relevance_score - a.relevance_score;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
    if (query.sort_order === 'asc' && sortBy === 'relevance') allResults.reverse();

    const offset = query.offset || 0;
    const limit = query.limit || 25;
    const paged = allResults.slice(offset, offset + limit);

    return {
      query,
      results: paged,
      total_count: allResults.length,
      returned_count: paged.length,
      searched_at: new Date().toISOString(),
      duration_ms: Date.now() - startTime,
    };
  }

  private scoreEntity(
    terms: string[],
    data: Record<string, unknown>,
    fields: string[],
  ): { score: number; matched_fields: string[] } {
    let totalScore = 0;
    const matchedFields: string[] = [];

    for (const field of fields) {
      const value = data[field];
      if (value == null) continue;
      const fieldText = String(value).toLowerCase();

      for (const term of terms) {
        if (fieldText.includes(term)) {
          totalScore += 1;
          if (!matchedFields.includes(field)) matchedFields.push(field);
        }
      }
    }

    if (terms.length > 0) totalScore = totalScore / terms.length;
    return { score: totalScore, matched_fields: matchedFields };
  }

  private passesFilters(data: Record<string, unknown>, filters: SearchFilter[]): boolean {
    for (const filter of filters) {
      const value = data[filter.field];
      switch (filter.operator) {
        case 'eq': if (value !== filter.value) return false; break;
        case 'neq': if (value === filter.value) return false; break;
        case 'contains': if (!String(value || '').toLowerCase().includes(String(filter.value).toLowerCase())) return false; break;
        case 'gt': if (Number(value) <= Number(filter.value)) return false; break;
        case 'lt': if (Number(value) >= Number(filter.value)) return false; break;
        case 'in': if (!Array.isArray(filter.value) || !filter.value.includes(value)) return false; break;
        default: break;
      }
    }
    return true;
  }

  private generateSnippet(terms: string[], data: Record<string, unknown>, fields: string[]): string {
    for (const field of fields) {
      const value = data[field];
      if (value == null) continue;
      const text = String(value);
      const lower = text.toLowerCase();

      for (const term of terms) {
        const idx = lower.indexOf(term);
        if (idx >= 0) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + term.length + 60);
          const prefix = start > 0 ? '...' : '';
          const suffix = end < text.length ? '...' : '';
          return `${prefix}${text.slice(start, end)}${suffix}`;
        }
      }
    }
    const firstField = fields.find(f => data[f] != null);
    return firstField ? String(data[firstField]).slice(0, 100) : '';
  }
}
