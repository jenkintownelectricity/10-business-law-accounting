/**
 * Doctrine Store
 * Manages read-only access to frozen doctrine entries.
 * The store itself is immutable — it loads doctrine once and never mutates it.
 */

import { DoctrineEntry } from '../../components/doctrine/DoctrinePane';

export class DoctrineStore {
  private entries: DoctrineEntry[] = [];
  private loaded: boolean = false;

  load(entries: DoctrineEntry[]): void {
    if (this.loaded) return; // Immutable after first load
    this.entries = Object.freeze([...entries]) as DoctrineEntry[];
    this.loaded = true;
  }

  getAll(): DoctrineEntry[] {
    return [...this.entries];
  }

  getById(id: string): DoctrineEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  getByCategory(category: string): DoctrineEntry[] {
    return this.entries.filter(e => e.category === category);
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
