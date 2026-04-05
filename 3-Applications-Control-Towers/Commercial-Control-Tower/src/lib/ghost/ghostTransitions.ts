/**
 * Ghost Layer Transition Controller
 * Manages enter/exit transitions for ghost overlays.
 * CSS-based transitions only — no JavaScript animation libraries.
 */

export type GhostTransitionState = 'hidden' | 'entering' | 'visible' | 'exiting';

export interface GhostTransitionConfig {
  enter_duration_ms: number;
  exit_duration_ms: number;
  reduced_motion: boolean;
}

export const DEFAULT_GHOST_TRANSITION: GhostTransitionConfig = {
  enter_duration_ms: 200,
  exit_duration_ms: 150,
  reduced_motion: false,
};

export function getGhostTransitionClass(state: GhostTransitionState, config: GhostTransitionConfig): string {
  if (config.reduced_motion) {
    return state === 'hidden' || state === 'exiting' ? 'ghost-hidden' : 'ghost-visible';
  }
  switch (state) {
    case 'hidden': return 'ghost-hidden';
    case 'entering': return 'ghost-entering';
    case 'visible': return 'ghost-visible';
    case 'exiting': return 'ghost-exiting';
  }
}

export class GhostTransitionController {
  private state: GhostTransitionState = 'hidden';
  private config: GhostTransitionConfig;

  constructor(config?: Partial<GhostTransitionConfig>) {
    this.config = { ...DEFAULT_GHOST_TRANSITION, ...config };
  }

  toggle(): GhostTransitionState {
    if (this.state === 'hidden') {
      this.state = 'entering';
      setTimeout(() => { this.state = 'visible'; }, this.config.enter_duration_ms);
    } else if (this.state === 'visible') {
      this.state = 'exiting';
      setTimeout(() => { this.state = 'hidden'; }, this.config.exit_duration_ms);
    }
    return this.state;
  }

  show(): void {
    if (this.state === 'hidden') this.toggle();
  }

  hide(): void {
    if (this.state === 'visible') this.toggle();
  }

  getState(): GhostTransitionState { return this.state; }
  getTransitionClass(): string { return getGhostTransitionClass(this.state, this.config); }
}
