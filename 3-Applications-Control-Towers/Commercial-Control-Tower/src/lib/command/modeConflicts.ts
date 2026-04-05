/**
 * Mode Conflict Rules
 * Deterministic conflict handling between modes and commands.
 */

export interface ModeConflict {
  mode: string;
  command_id: string;
  resolution: 'disabled' | 'suppressed' | 'blocked' | 'allowed_with_warning';
  reason: string;
}

export const MODE_CONFLICTS: ModeConflict[] = [
  { mode: 'replay', command_id: 'ghost.toggle', resolution: 'disabled', reason: 'Ghost layer disabled in replay mode' },
  { mode: 'replay', command_id: 'ghost.promote', resolution: 'disabled', reason: 'Promotion disabled in replay mode' },
  { mode: 'replay', command_id: 'ghost.shadow', resolution: 'disabled', reason: 'Shadow overlay disabled in replay mode' },
  { mode: 'quiet', command_id: 'ghost.shadow', resolution: 'suppressed', reason: 'Shadow advisory suppressed in quiet mode' },
  { mode: 'locked_review', command_id: 'focus.transfer.next', resolution: 'blocked', reason: 'Focus transfer blocked during locked review' },
  { mode: 'locked_review', command_id: 'focus.transfer.prev', resolution: 'blocked', reason: 'Focus transfer blocked during locked review' },
  { mode: 'doctrine_pane', command_id: 'ghost.promote', resolution: 'allowed_with_warning', reason: 'Promotion allowed but doctrine pane remains read-only' },
];

export function getConflict(mode: string, commandId: string): ModeConflict | undefined {
  return MODE_CONFLICTS.find(c => c.mode === mode && c.command_id === commandId);
}
