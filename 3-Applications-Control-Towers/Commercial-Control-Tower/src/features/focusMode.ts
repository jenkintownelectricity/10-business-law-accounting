// ──────────────────────────────────────────────────────────────
//  Focus Mode — Matter Detail Deep Review
//  Hides non-essential chrome on matter detail pages.
//  Shows only: matter core, evidence, constraints, decisions, tasks.
//  Optimized for deep review with optional hands-free read-back.
//  Keyboard shortcut: Ctrl+Shift+F
// ──────────────────────────────────────────────────────────────

import type { Matter, KernelDomain } from '@10-bla/domain-objects';

// ── Configuration ────────────────────────────────────────────

export type FocusSection =
  | 'matter_core'
  | 'evidence'
  | 'constraints'
  | 'decisions'
  | 'tasks'
  | 'notes'
  | 'timeline'
  | 'contracts'
  | 'obligations'
  | 'accounting'
  | 'sidebar'
  | 'header'
  | 'footer'
  | 'navigation'
  | 'notifications'
  | 'review_queue';

export interface FocusModeConfig {
  enabled: boolean;
  hides_chrome: boolean;
  visible_sections: FocusSection[];
  hidden_sections: FocusSection[];
  supports_readback: boolean;
  readback_voice_id?: string;
  readback_speed: number;
  auto_scroll: boolean;
  keyboard_shortcut: string;
}

export const FOCUS_MODE_DEFAULTS: FocusModeConfig = {
  enabled: false,
  hides_chrome: true,
  visible_sections: ['matter_core', 'evidence', 'constraints', 'decisions', 'tasks'],
  hidden_sections: ['sidebar', 'header', 'footer', 'navigation', 'notifications', 'review_queue'],
  supports_readback: true,
  readback_speed: 1.0,
  auto_scroll: true,
  keyboard_shortcut: 'Ctrl+Shift+F',
};

// ── Readback Content ─────────────────────────────────────────

export interface ReadbackContent {
  matter_id: string;
  sections: ReadbackSection[];
  total_estimated_duration_seconds: number;
  generated_at: string;
}

export interface ReadbackSection {
  section_name: string;
  content: string;
  priority: 'essential' | 'supplementary';
  estimated_duration_seconds: number;
}

// ── Focus Mode Controller ────────────────────────────────────

export class FocusModeController {
  private config: FocusModeConfig;
  private isReadbackActive = false;
  private currentReadbackSection = 0;

  constructor(initialConfig?: Partial<FocusModeConfig>) {
    this.config = { ...FOCUS_MODE_DEFAULTS, ...initialConfig };
  }

  // ── Toggle & State ─────────────────────────────────────────

  toggle(): boolean {
    this.config.enabled = !this.config.enabled;
    if (!this.config.enabled) {
      this.stopReadback();
    }
    return this.config.enabled;
  }

  enable(): void {
    this.config.enabled = true;
  }

  disable(): void {
    this.config.enabled = false;
    this.stopReadback();
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): Readonly<FocusModeConfig> {
    return { ...this.config };
  }

  // ── Section Visibility ─────────────────────────────────────

  getVisibleSections(): FocusSection[] {
    if (!this.config.enabled) return [];
    return [...this.config.visible_sections];
  }

  getHiddenSections(): FocusSection[] {
    if (!this.config.enabled) return [];
    return [...this.config.hidden_sections];
  }

  shouldHideSection(sectionId: FocusSection): boolean {
    if (!this.config.enabled) return false;
    return !this.config.visible_sections.includes(sectionId);
  }

  shouldShowSection(sectionId: FocusSection): boolean {
    if (!this.config.enabled) return true;
    return this.config.visible_sections.includes(sectionId);
  }

  addVisibleSection(section: FocusSection): void {
    if (!this.config.visible_sections.includes(section)) {
      this.config.visible_sections.push(section);
      this.config.hidden_sections = this.config.hidden_sections.filter(s => s !== section);
    }
  }

  removeVisibleSection(section: FocusSection): void {
    this.config.visible_sections = this.config.visible_sections.filter(s => s !== section);
    if (!this.config.hidden_sections.includes(section)) {
      this.config.hidden_sections.push(section);
    }
  }

  // ── Readback Support ───────────────────────────────────────

  supportsReadback(): boolean {
    return this.config.supports_readback;
  }

  generateReadbackContent(matter: Matter): ReadbackContent {
    const sections: ReadbackSection[] = [];

    // Core matter info
    sections.push({
      section_name: 'Matter Overview',
      content: `Matter: ${matter.title}. Status: ${matter.status}. Priority: ${matter.priority}. Type: ${matter.matter_type}. Assigned kernels: ${matter.assigned_kernels.join(', ') || 'none'}.`,
      priority: 'essential',
      estimated_duration_seconds: 8,
    });

    // Description
    if (matter.description) {
      sections.push({
        section_name: 'Description',
        content: matter.description,
        priority: 'essential',
        estimated_duration_seconds: Math.ceil(matter.description.split(' ').length / 2.5),
      });
    }

    // Follow-up actions
    if (matter.follow_up_actions.length > 0) {
      const actionText = matter.follow_up_actions
        .map(a => `${a.title}: ${a.status}, priority ${a.priority}, assigned to ${a.assigned_kernel}`)
        .join('. ');
      sections.push({
        section_name: 'Follow-up Actions',
        content: `${matter.follow_up_actions.length} follow-up actions. ${actionText}`,
        priority: 'essential',
        estimated_duration_seconds: Math.ceil(actionText.split(' ').length / 2.5),
      });
    }

    // Notes summary
    if (matter.notes.length > 0) {
      const latestNotes = matter.notes.slice(-3);
      const notesText = latestNotes.map(n => `${n.note_type} note: ${n.content.slice(0, 100)}`).join('. ');
      sections.push({
        section_name: 'Recent Notes',
        content: `${matter.notes.length} total notes. Most recent: ${notesText}`,
        priority: 'supplementary',
        estimated_duration_seconds: Math.ceil(notesText.split(' ').length / 2.5),
      });
    }

    // Evidence count
    if (matter.evidence_ids.length > 0) {
      sections.push({
        section_name: 'Evidence',
        content: `${matter.evidence_ids.length} evidence items linked to this matter.`,
        priority: 'supplementary',
        estimated_duration_seconds: 3,
      });
    }

    // Related items
    const relatedCounts = [
      matter.related_contracts.length > 0 ? `${matter.related_contracts.length} contracts` : null,
      matter.related_obligations.length > 0 ? `${matter.related_obligations.length} obligations` : null,
      matter.related_accounting_events.length > 0 ? `${matter.related_accounting_events.length} accounting events` : null,
    ].filter(Boolean);

    if (relatedCounts.length > 0) {
      sections.push({
        section_name: 'Related Items',
        content: `Related items: ${relatedCounts.join(', ')}.`,
        priority: 'supplementary',
        estimated_duration_seconds: 4,
      });
    }

    const totalDuration = sections.reduce((sum, s) => sum + s.estimated_duration_seconds, 0);

    return {
      matter_id: matter.id,
      sections,
      total_estimated_duration_seconds: totalDuration,
      generated_at: new Date().toISOString(),
    };
  }

  startReadback(): void {
    if (!this.config.supports_readback) return;
    this.isReadbackActive = true;
    this.currentReadbackSection = 0;
  }

  stopReadback(): void {
    this.isReadbackActive = false;
    this.currentReadbackSection = 0;
  }

  isReadbackInProgress(): boolean {
    return this.isReadbackActive;
  }

  nextReadbackSection(): number {
    this.currentReadbackSection++;
    return this.currentReadbackSection;
  }

  getCurrentReadbackSection(): number {
    return this.currentReadbackSection;
  }

  setReadbackSpeed(speed: number): void {
    this.config.readback_speed = Math.max(0.5, Math.min(3.0, speed));
  }

  getReadbackSpeed(): number {
    return this.config.readback_speed;
  }
}

// ── Keyboard Shortcut Registration ───────────────────────────

export function registerFocusModeShortcut(
  controller: FocusModeController,
  onToggle: (enabled: boolean) => void
): () => void {
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      const enabled = controller.toggle();
      onToggle(enabled);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }
  return () => {};
}
