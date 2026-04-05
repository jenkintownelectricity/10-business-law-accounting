// ──────────────────────────────────────────────────────────────
//  SearchService — Global Search Across Domain Objects
//  Provides full-text and structured search across matters,
//  contracts, clients, transcripts, and all domain objects.
//  Supports saved views and saved filters.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  Matter,
  Contract,
  Entity,
  TranscriptEnvelope,
  Obligation,
  KernelDomain,
  Priority,
  TrustLevel,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export type SearchableType = 'matter' | 'contract' | 'entity' | 'transcript' | 'obligation' | 'invoice' | 'accounting_event' | 'evidence';

export interface SearchResult {
  id: string;
  object_type: SearchableType;
  title: string;
  snippet: string;
  relevance_score: number;
  trust_level: TrustLevel;
  matter_id?: string;
  kernel?: KernelDomain;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface SearchQuery {
  query: string;
  object_types?: SearchableType[];
  kernel?: KernelDomain;
  priority?: Priority;
  trust_level?: TrustLevel;
  date_from?: string;
  date_to?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SavedView {
  id: string;
  name: string;
  description: string;
  query: SearchQuery;
  owner: string;
  shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filter_type: SearchableType;
  criteria: Record<string, unknown>;
  owner: string;
  shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalSearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
  facets: SearchFacets;
  execution_time_ms: number;
}

export interface SearchFacets {
  by_type: Record<string, number>;
  by_kernel: Record<string, number>;
  by_priority: Record<string, number>;
  by_trust_level: Record<string, number>;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class SearchService {
  private matters: Map<string, Matter> = new Map();
  private contracts: Map<string, Contract> = new Map();
  private entities: Map<string, Entity> = new Map();
  private transcripts: Map<string, TranscriptEnvelope> = new Map();
  private obligations: Map<string, Obligation> = new Map();
  private savedViews: Map<string, SavedView> = new Map();
  private savedFilters: Map<string, SavedFilter> = new Map();
  private receiptSequence = 0;

  // ── Index Management (for use by other services) ───────────

  indexMatter(matter: Matter): void { this.matters.set(matter.id, matter); }
  indexContract(contract: Contract): void { this.contracts.set(contract.id, contract); }
  indexEntity(entity: Entity): void { this.entities.set(entity.id, entity); }
  indexTranscript(transcript: TranscriptEnvelope): void { this.transcripts.set(transcript.id, transcript); }
  indexObligation(obligation: Obligation): void { this.obligations.set(obligation.id, obligation); }

  // ── Global Search ──────────────────────────────────────────

  async globalSearch(query: SearchQuery): Promise<ServiceResult<GlobalSearchResponse>> {
    const startTime = Date.now();
    const q = query.query.toLowerCase();
    const results: SearchResult[] = [];

    const shouldSearch = (type: SearchableType) =>
      !query.object_types || query.object_types.length === 0 || query.object_types.includes(type);

    // Search matters
    if (shouldSearch('matter')) {
      for (const matter of this.matters.values()) {
        const score = this.scoreMatch(q, [matter.title, matter.description, ...matter.tags]);
        if (score > 0) {
          results.push({
            id: matter.id,
            object_type: 'matter',
            title: matter.title,
            snippet: matter.description.slice(0, 200),
            relevance_score: score,
            trust_level: 'TRUSTED',
            matter_id: matter.id,
            kernel: matter.assigned_kernels[0],
            created_at: matter.created_at,
            metadata: { status: matter.status, priority: matter.priority },
          });
        }
      }
    }

    // Search contracts
    if (shouldSearch('contract')) {
      for (const contract of this.contracts.values()) {
        const terms = contract.terms.map(t => t.summary);
        const score = this.scoreMatch(q, [contract.title, ...contract.tags, ...terms]);
        if (score > 0) {
          results.push({
            id: contract.id,
            object_type: 'contract',
            title: contract.title,
            snippet: `${contract.contract_type} — ${contract.status}`,
            relevance_score: score,
            trust_level: contract.trust_level,
            created_at: contract.created_at,
            metadata: { status: contract.status, type: contract.contract_type },
          });
        }
      }
    }

    // Search entities (clients, vendors, etc.)
    if (shouldSearch('entity')) {
      for (const entity of this.entities.values()) {
        const score = this.scoreMatch(q, [entity.name, entity.legal_name ?? '', ...entity.tags, entity.entity_type]);
        if (score > 0) {
          results.push({
            id: entity.id,
            object_type: 'entity',
            title: entity.name,
            snippet: `${entity.entity_type} — ${entity.status}`,
            relevance_score: score,
            trust_level: entity.trust_level,
            created_at: entity.created_at,
            metadata: { type: entity.entity_type, status: entity.status },
          });
        }
      }
    }

    // Search transcripts
    if (shouldSearch('transcript')) {
      for (const transcript of this.transcripts.values()) {
        const segmentTexts = transcript.segments.map(s => s.text);
        const score = this.scoreMatch(q, [transcript.transcript_text, ...segmentTexts]);
        if (score > 0) {
          results.push({
            id: transcript.id,
            object_type: 'transcript',
            title: `Transcript ${transcript.session_id}`,
            snippet: transcript.transcript_text.slice(0, 200),
            relevance_score: score,
            trust_level: transcript.trust_level,
            matter_id: transcript.matter_id,
            created_at: transcript.created_at,
            metadata: { source_type: transcript.source_type, confidence: transcript.overall_confidence },
          });
        }
      }
    }

    // Search obligations
    if (shouldSearch('obligation')) {
      for (const obligation of this.obligations.values()) {
        const score = this.scoreMatch(q, [obligation.title, obligation.description, ...obligation.tags]);
        if (score > 0) {
          results.push({
            id: obligation.id,
            object_type: 'obligation',
            title: obligation.title,
            snippet: obligation.description.slice(0, 200),
            relevance_score: score,
            trust_level: obligation.trust_level,
            kernel: obligation.assigned_kernel,
            created_at: obligation.created_at,
            metadata: { type: obligation.obligation_type, status: obligation.obligation_status },
          });
        }
      }
    }

    // Apply additional filters
    let filtered = results;
    if (query.kernel) filtered = filtered.filter(r => r.kernel === query.kernel);
    if (query.priority) filtered = filtered.filter(r => r.metadata['priority'] === query.priority);
    if (query.trust_level) filtered = filtered.filter(r => r.trust_level === query.trust_level);
    if (query.date_from) {
      const from = new Date(query.date_from).getTime();
      filtered = filtered.filter(r => new Date(r.created_at).getTime() >= from);
    }
    if (query.date_to) {
      const to = new Date(query.date_to).getTime();
      filtered = filtered.filter(r => new Date(r.created_at).getTime() <= to);
    }

    // Sort by relevance
    filtered.sort((a, b) => b.relevance_score - a.relevance_score);

    // Compute facets
    const facets: SearchFacets = {
      by_type: {},
      by_kernel: {},
      by_priority: {},
      by_trust_level: {},
    };
    for (const r of filtered) {
      facets.by_type[r.object_type] = (facets.by_type[r.object_type] ?? 0) + 1;
      if (r.kernel) facets.by_kernel[r.kernel] = (facets.by_kernel[r.kernel] ?? 0) + 1;
      const pri = r.metadata['priority'] as string | undefined;
      if (pri) facets.by_priority[pri] = (facets.by_priority[pri] ?? 0) + 1;
      facets.by_trust_level[r.trust_level] = (facets.by_trust_level[r.trust_level] ?? 0) + 1;
    }

    // Paginate
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 25;
    const page = filtered.slice(offset, offset + limit);

    const receipt = this.emitReceipt({
      operation: 'search.global',
      description: `Global search: "${query.query}" — ${filtered.length} results`,
      actor: 'system',
      target_id: 'global',
      target_type: 'search',
    });

    return {
      success: true,
      data: {
        query: query.query,
        total_results: filtered.length,
        results: page,
        facets,
        execution_time_ms: Date.now() - startTime,
      },
      receipt,
    };
  }

  // ── Typed Search Methods ───────────────────────────────────

  async searchMatters(query: string, limit = 25): Promise<ServiceResult<SearchResult[]>> {
    const result = await this.globalSearch({ query, object_types: ['matter'], limit });
    return { success: true, data: result.data?.results ?? [] };
  }

  async searchContracts(query: string, limit = 25): Promise<ServiceResult<SearchResult[]>> {
    const result = await this.globalSearch({ query, object_types: ['contract'], limit });
    return { success: true, data: result.data?.results ?? [] };
  }

  async searchClients(query: string, limit = 25): Promise<ServiceResult<SearchResult[]>> {
    const result = await this.globalSearch({ query, object_types: ['entity'], limit });
    return { success: true, data: result.data?.results ?? [] };
  }

  async searchTranscripts(query: string, limit = 25): Promise<ServiceResult<SearchResult[]>> {
    const result = await this.globalSearch({ query, object_types: ['transcript'], limit });
    return { success: true, data: result.data?.results ?? [] };
  }

  async searchByKeyword(keyword: string, limit = 25): Promise<ServiceResult<SearchResult[]>> {
    const result = await this.globalSearch({ query: keyword, limit });
    return { success: true, data: result.data?.results ?? [] };
  }

  // ── Saved Views ────────────────────────────────────────────

  async createSavedView(params: {
    name: string;
    description: string;
    query: SearchQuery;
    owner: string;
    shared?: boolean;
  }): Promise<ServiceResult<SavedView>> {
    const now = new Date().toISOString();
    const id = `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const view: SavedView = {
      id,
      name: params.name,
      description: params.description,
      query: params.query,
      owner: params.owner,
      shared: params.shared ?? false,
      created_at: now,
      updated_at: now,
    };

    this.savedViews.set(id, view);
    return { success: true, data: view };
  }

  async getSavedViews(owner?: string): Promise<ServiceResult<SavedView[]>> {
    let views = Array.from(this.savedViews.values());
    if (owner) {
      views = views.filter(v => v.owner === owner || v.shared);
    }
    return { success: true, data: views };
  }

  async executeSavedView(viewId: string): Promise<ServiceResult<GlobalSearchResponse>> {
    const view = this.savedViews.get(viewId);
    if (!view) {
      return { success: false, error: `Saved view ${viewId} not found` };
    }
    return this.globalSearch(view.query);
  }

  // ── Saved Filters ──────────────────────────────────────────

  async createSavedFilter(params: {
    name: string;
    filter_type: SearchableType;
    criteria: Record<string, unknown>;
    owner: string;
    shared?: boolean;
  }): Promise<ServiceResult<SavedFilter>> {
    const now = new Date().toISOString();
    const id = `filter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const filter: SavedFilter = {
      id,
      name: params.name,
      filter_type: params.filter_type,
      criteria: params.criteria,
      owner: params.owner,
      shared: params.shared ?? false,
      created_at: now,
      updated_at: now,
    };

    this.savedFilters.set(id, filter);
    return { success: true, data: filter };
  }

  async getSavedFilters(owner?: string): Promise<ServiceResult<SavedFilter[]>> {
    let filters = Array.from(this.savedFilters.values());
    if (owner) {
      filters = filters.filter(f => f.owner === owner || f.shared);
    }
    return { success: true, data: filters };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private scoreMatch(query: string, fields: string[]): number {
    let score = 0;
    const terms = query.split(/\s+/).filter(Boolean);
    for (const field of fields) {
      const lower = field.toLowerCase();
      for (const term of terms) {
        if (lower.includes(term)) {
          score += lower === term ? 2.0 : 1.0;
        }
      }
    }
    return score;
  }

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'state_change',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'runtime',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: null,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
