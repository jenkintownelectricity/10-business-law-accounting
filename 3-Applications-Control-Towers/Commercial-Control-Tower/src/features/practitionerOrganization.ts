// ──────────────────────────────────────────────────────────────
//  Practitioner Organization Features
//  Core organization tools for the Commercial Control Tower:
//  pinned matters/counterparties, recently viewed, saved views,
//  saved filters, due-today/due-soon slices, unresolved risks,
//  and a practitioner scratchpad.
// ──────────────────────────────────────────────────────────────

import type {
  Matter,
  KernelDomain,
  Priority,
  MatterStatus,
} from '../../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

// ── Pinned Matters ───────────────────────────────────────────

export interface PinnedMatter {
  matter_id: string;
  title: string;
  priority: Priority;
  status: MatterStatus;
  pinned_at: string;
  pinned_by: string;
  sort_order: number;
}

export class PinnedMatters {
  private items: Map<string, PinnedMatter> = new Map();

  pin(matter: Matter, pinnedBy: string): PinnedMatter {
    const pinned: PinnedMatter = {
      matter_id: matter.id,
      title: matter.title,
      priority: matter.priority,
      status: matter.status,
      pinned_at: new Date().toISOString(),
      pinned_by: pinnedBy,
      sort_order: this.items.size,
    };
    this.items.set(matter.id, pinned);
    return pinned;
  }

  unpin(matterId: string): boolean {
    return this.items.delete(matterId);
  }

  isPinned(matterId: string): boolean {
    return this.items.has(matterId);
  }

  list(): PinnedMatter[] {
    return Array.from(this.items.values()).sort((a, b) => a.sort_order - b.sort_order);
  }

  reorder(matterId: string, newPosition: number): void {
    const item = this.items.get(matterId);
    if (!item) return;
    item.sort_order = newPosition;
  }

  count(): number {
    return this.items.size;
  }
}

// ── Pinned Counterparties ────────────────────────────────────

export interface PinnedCounterparty {
  entity_id: string;
  name: string;
  entity_type: string;
  pinned_at: string;
  pinned_by: string;
  associated_matter_count: number;
}

export class PinnedCounterparties {
  private items: Map<string, PinnedCounterparty> = new Map();

  pin(params: { entity_id: string; name: string; entity_type: string; associated_matter_count: number }, pinnedBy: string): PinnedCounterparty {
    const pinned: PinnedCounterparty = {
      ...params,
      pinned_at: new Date().toISOString(),
      pinned_by: pinnedBy,
    };
    this.items.set(params.entity_id, pinned);
    return pinned;
  }

  unpin(entityId: string): boolean {
    return this.items.delete(entityId);
  }

  isPinned(entityId: string): boolean {
    return this.items.has(entityId);
  }

  list(): PinnedCounterparty[] {
    return Array.from(this.items.values());
  }

  count(): number {
    return this.items.size;
  }
}

// ── Recently Viewed ──────────────────────────────────────────

export interface RecentlyViewedItem {
  object_id: string;
  object_type: 'matter' | 'contract' | 'obligation' | 'entity' | 'invoice' | 'transcript' | 'decision_bundle';
  title: string;
  viewed_at: string;
  viewed_by: string;
}

export class RecentlyViewed {
  private items: RecentlyViewedItem[] = [];
  private maxItems: number;

  constructor(maxItems = 50) {
    this.maxItems = maxItems;
  }

  record(params: Omit<RecentlyViewedItem, 'viewed_at'> & { viewed_at?: string }): void {
    // Remove existing entry for same object
    this.items = this.items.filter(
      i => !(i.object_id === params.object_id && i.object_type === params.object_type)
    );

    this.items.unshift({
      ...params,
      viewed_at: params.viewed_at ?? new Date().toISOString(),
    });

    // Trim to max
    if (this.items.length > this.maxItems) {
      this.items = this.items.slice(0, this.maxItems);
    }
  }

  list(limit?: number): RecentlyViewedItem[] {
    return this.items.slice(0, limit ?? this.maxItems);
  }

  listByType(objectType: RecentlyViewedItem['object_type'], limit = 10): RecentlyViewedItem[] {
    return this.items.filter(i => i.object_type === objectType).slice(0, limit);
  }

  clear(): void {
    this.items = [];
  }

  count(): number {
    return this.items.length;
  }
}

// ── Saved Views ──────────────────────────────────────────────

export interface SavedViewConfig {
  id: string;
  name: string;
  description: string;
  object_type: string;
  filters: Record<string, unknown>;
  sort_by: string;
  sort_direction: 'asc' | 'desc';
  columns?: string[];
  owner: string;
  shared: boolean;
  created_at: string;
  updated_at: string;
}

export class SavedViews {
  private views: Map<string, SavedViewConfig> = new Map();

  create(params: Omit<SavedViewConfig, 'id' | 'created_at' | 'updated_at'>): SavedViewConfig {
    const id = `view_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const view: SavedViewConfig = { ...params, id, created_at: now, updated_at: now };
    this.views.set(id, view);
    return view;
  }

  update(id: string, updates: Partial<Omit<SavedViewConfig, 'id' | 'created_at'>>): SavedViewConfig | null {
    const view = this.views.get(id);
    if (!view) return null;
    Object.assign(view, updates, { updated_at: new Date().toISOString() });
    return view;
  }

  delete(id: string): boolean {
    return this.views.delete(id);
  }

  get(id: string): SavedViewConfig | undefined {
    return this.views.get(id);
  }

  list(owner?: string): SavedViewConfig[] {
    const views = Array.from(this.views.values());
    if (owner) return views.filter(v => v.owner === owner || v.shared);
    return views;
  }
}

// ── Saved Filters ────────────────────────────────────────────

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'between' | 'not_in';
  value: unknown;
}

export interface SavedFilterConfig {
  id: string;
  name: string;
  object_type: string;
  conditions: FilterCondition[];
  owner: string;
  shared: boolean;
  created_at: string;
  updated_at: string;
}

export class SavedFilters {
  private filters: Map<string, SavedFilterConfig> = new Map();

  create(params: Omit<SavedFilterConfig, 'id' | 'created_at' | 'updated_at'>): SavedFilterConfig {
    const id = `filter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const filter: SavedFilterConfig = { ...params, id, created_at: now, updated_at: now };
    this.filters.set(id, filter);
    return filter;
  }

  update(id: string, updates: Partial<Omit<SavedFilterConfig, 'id' | 'created_at'>>): SavedFilterConfig | null {
    const filter = this.filters.get(id);
    if (!filter) return null;
    Object.assign(filter, updates, { updated_at: new Date().toISOString() });
    return filter;
  }

  delete(id: string): boolean {
    return this.filters.delete(id);
  }

  get(id: string): SavedFilterConfig | undefined {
    return this.filters.get(id);
  }

  list(owner?: string): SavedFilterConfig[] {
    const filters = Array.from(this.filters.values());
    if (owner) return filters.filter(f => f.owner === owner || f.shared);
    return filters;
  }
}

// ── Due Today Slice ──────────────────────────────────────────

export interface DueItem {
  id: string;
  object_type: 'obligation' | 'deadline' | 'follow_up_action' | 'review_item';
  title: string;
  due_date: string;
  priority: Priority;
  assigned_kernel?: KernelDomain;
  matter_id?: string;
  matter_title?: string;
  status: string;
}

export class DueTodaySlice {
  private items: DueItem[] = [];

  refresh(allItems: DueItem[]): void {
    const today = new Date().toISOString().slice(0, 10);
    this.items = allItems.filter(item => item.due_date.slice(0, 10) === today);
    this.items.sort((a, b) => {
      const pOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }

  list(): DueItem[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }

  criticalCount(): number {
    return this.items.filter(i => i.priority === 'critical').length;
  }
}

// ── Due Soon Slice ───────────────────────────────────────────

export class DueSoonSlice {
  private items: DueItem[] = [];
  private windowDays: number;

  constructor(windowDays = 7) {
    this.windowDays = windowDays;
  }

  setWindow(days: number): void {
    this.windowDays = days;
  }

  getWindow(): number {
    return this.windowDays;
  }

  refresh(allItems: DueItem[]): void {
    const now = Date.now();
    const cutoff = now + this.windowDays * 24 * 60 * 60 * 1000;
    const today = new Date().toISOString().slice(0, 10);

    this.items = allItems.filter(item => {
      const dueTime = new Date(item.due_date).getTime();
      const dueDay = item.due_date.slice(0, 10);
      return dueDay > today && dueTime <= cutoff;
    });

    this.items.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }

  list(): DueItem[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }

  byKernel(kernel: KernelDomain): DueItem[] {
    return this.items.filter(i => i.assigned_kernel === kernel);
  }
}

// ── Unresolved Risk Slice ────────────────────────────────────

export interface UnresolvedRisk {
  id: string;
  matter_id: string;
  matter_title: string;
  risk_category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  owning_kernel: KernelDomain;
  identified_at: string;
  days_open: number;
}

export class UnresolvedRiskSlice {
  private risks: UnresolvedRisk[] = [];

  refresh(allRisks: UnresolvedRisk[]): void {
    this.risks = allRisks.sort((a, b) => {
      const sOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sOrder[a.severity] ?? 4) - (sOrder[b.severity] ?? 4);
    });
  }

  list(): UnresolvedRisk[] {
    return [...this.risks];
  }

  count(): number {
    return this.risks.length;
  }

  criticalAndHigh(): UnresolvedRisk[] {
    return this.risks.filter(r => r.severity === 'critical' || r.severity === 'high');
  }

  byKernel(kernel: KernelDomain): UnresolvedRisk[] {
    return this.risks.filter(r => r.owning_kernel === kernel);
  }

  byMatter(matterId: string): UnresolvedRisk[] {
    return this.risks.filter(r => r.matter_id === matterId);
  }
}

// ── Practitioner Scratchpad ──────────────────────────────────

export interface ScratchpadEntry {
  id: string;
  content: string;
  matter_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export class PractitionerScratchpad {
  private entries: Map<string, ScratchpadEntry> = new Map();

  add(content: string, createdBy: string, options?: { matter_id?: string; tags?: string[] }): ScratchpadEntry {
    const now = new Date().toISOString();
    const id = `scratch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const entry: ScratchpadEntry = {
      id,
      content,
      matter_id: options?.matter_id,
      tags: options?.tags ?? [],
      created_at: now,
      updated_at: now,
      created_by: createdBy,
    };
    this.entries.set(id, entry);
    return entry;
  }

  update(id: string, content: string): ScratchpadEntry | null {
    const entry = this.entries.get(id);
    if (!entry) return null;
    entry.content = content;
    entry.updated_at = new Date().toISOString();
    return entry;
  }

  remove(id: string): boolean {
    return this.entries.delete(id);
  }

  list(): ScratchpadEntry[] {
    return Array.from(this.entries.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  search(query: string): ScratchpadEntry[] {
    const lower = query.toLowerCase();
    return this.list().filter(
      e => e.content.toLowerCase().includes(lower) || e.tags.some(t => t.toLowerCase().includes(lower))
    );
  }

  byMatter(matterId: string): ScratchpadEntry[] {
    return this.list().filter(e => e.matter_id === matterId);
  }

  count(): number {
    return this.entries.size;
  }

  clear(): void {
    this.entries.clear();
  }
}
