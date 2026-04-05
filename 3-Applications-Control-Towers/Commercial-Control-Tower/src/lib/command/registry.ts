/**
 * Canonical Command Registry
 * The single source of truth for all operator commands in the CCT.
 * Every command declares: id, label, category, handler, trust_class,
 * execution_class, focus_effect, replay_valid, receipt_class.
 */

export type CommandCategory = 'focus' | 'ghost' | 'navigation' | 'lineage' | 'system' | 'workspace' | 'doctrine';
export type TrustClass = 'UI_ONLY' | 'SIGNAL_REQUIRED' | 'PROMOTION_REQUIRED';
export type ExecutionClass = 'IMMEDIATE' | 'ASYNC_SIGNAL' | 'DEFERRED';
export type FocusEffect = 'NONE' | 'TRANSFER' | 'LOCK' | 'UNLOCK' | 'QUIET_TOGGLE';
export type ReceiptClass = 'NONE' | 'TRANSIENT' | 'EMIT' | 'REPLAY_REFERENCE';

export interface CommandContext {
  active_pane_id: string | null;
  active_pane_type: string | null;
  selected_entity_id: string | null;
  selected_entity_type: string | null;
  has_active_ghost: boolean;
  has_active_evidence: boolean;
  has_lineage_state: boolean;
  is_quiet_mode: boolean;
  is_locked_review: boolean;
  is_replay_mode: boolean;
}

export interface CommandDefinition {
  id: string;
  label: string;
  category: CommandCategory;
  description: string;
  shortcut?: string;
  handler: (context: CommandContext) => Promise<CommandResult>;
  trust_class: TrustClass;
  execution_class: ExecutionClass;
  focus_effect: FocusEffect;
  replay_valid: boolean;
  receipt_class: ReceiptClass;
  context_requirements: (context: CommandContext) => boolean;
  disabled_reason_resolver: (context: CommandContext) => string | null;
}

export interface CommandResult {
  success: boolean;
  command_id: string;
  message?: string;
  signal_id?: string;
  receipt_id?: string;
  error?: string;
}

class CommandRegistryImpl {
  private commands: Map<string, CommandDefinition> = new Map();

  register(command: CommandDefinition): void {
    if (this.commands.has(command.id)) {
      throw new Error(`Command ${command.id} already registered`);
    }
    this.commands.set(command.id, command);
  }

  getCommandById(id: string): CommandDefinition | undefined {
    return this.commands.get(id);
  }

  searchCommands(query: string): CommandDefinition[] {
    const q = query.toLowerCase();
    return Array.from(this.commands.values()).filter(cmd =>
      cmd.id.includes(q) || cmd.label.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q)
    );
  }

  isCommandEnabled(id: string, context: CommandContext): boolean {
    const cmd = this.commands.get(id);
    if (!cmd) return false;
    if (!cmd.replay_valid && context.is_replay_mode) return false;
    return cmd.context_requirements(context);
  }

  getDisabledReason(id: string, context: CommandContext): string | null {
    const cmd = this.commands.get(id);
    if (!cmd) return 'Command not found';
    if (!cmd.replay_valid && context.is_replay_mode) return 'Not available in replay mode';
    return cmd.disabled_reason_resolver(context);
  }

  async executeCommand(id: string, context: CommandContext): Promise<CommandResult> {
    const cmd = this.commands.get(id);
    if (!cmd) return { success: false, command_id: id, error: 'Command not found' };
    if (!this.isCommandEnabled(id, context)) {
      const reason = this.getDisabledReason(id, context);
      return { success: false, command_id: id, error: reason || 'Command disabled' };
    }
    return cmd.handler(context);
  }

  getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  getCommandsByCategory(category: CommandCategory): CommandDefinition[] {
    return this.getAllCommands().filter(c => c.category === category);
  }
}

export const CommandRegistry = new CommandRegistryImpl();
