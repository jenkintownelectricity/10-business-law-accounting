/**
 * Focus Mode
 * Hides non-essential chrome on matter detail pages.
 * Shows only: matter core, evidence, constraints, decisions, tasks.
 * Keyboard shortcut: Ctrl+Shift+F
 */

export interface FocusModeConfig {
  enabled: boolean;
  hides_chrome: boolean;
  visible_sections: string[];
  supports_readback: boolean;
}

export const FOCUS_MODE_DEFAULTS: FocusModeConfig = {
  enabled: false,
  hides_chrome: true,
  visible_sections: ['matter_core', 'evidence', 'constraints', 'decisions', 'tasks'],
  supports_readback: true,
};

export class FocusModeController {
  private config: FocusModeConfig;

  constructor(initialConfig?: Partial<FocusModeConfig>) {
    this.config = { ...FOCUS_MODE_DEFAULTS, ...initialConfig };
  }

  toggle(): boolean {
    this.config.enabled = !this.config.enabled;
    return this.config.enabled;
  }

  enable(): void {
    this.config.enabled = true;
  }

  disable(): void {
    this.config.enabled = false;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getVisibleSections(): string[] {
    return this.config.enabled ? this.config.visible_sections : [];
  }

  shouldHideSection(sectionId: string): boolean {
    if (!this.config.enabled) return false;
    return !this.config.visible_sections.includes(sectionId);
  }

  supportsReadback(): boolean {
    return this.config.supports_readback;
  }
}

/** Keyboard shortcut handler for Focus Mode */
export function registerFocusModeShortcut(controller: FocusModeController, onToggle: (enabled: boolean) => void): () => void {
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
