/**
 * Command Executor
 *
 * Executes commands by dispatching to focus store, vkbus client, or navigation.
 * All domain-affecting actions route through VKBUS -- never direct kernel calls.
 */

export interface CommandExecutionResult {
  success: boolean;
  commandId: string;
  timestamp: string;
  message?: string;
  error?: string;
}

export interface CommandExecutorDeps {
  focusStore: {
    focusNext: () => void;
    focusPrev: () => void;
    focusPane: (paneId: string) => void;
    focusLock: () => void;
    quietOn: () => void;
    quietOff: () => void;
    focusQueue: () => void;
  };
  vkbusClient: {
    emit: (signal: string, payload: Record<string, unknown>) => Promise<void>;
  };
  navigation: {
    navigate: (target: string) => void;
  };
}

export function createCommandExecutor(deps: CommandExecutorDeps) {
  const handlers: Record<string, (args?: Record<string, unknown>) => Promise<CommandExecutionResult>> = {
    // Focus handlers -- dispatch to focus store
    async focusNext() {
      deps.focusStore.focusNext();
      return success('focus.next');
    },
    async focusPrev() {
      deps.focusStore.focusPrev();
      return success('focus.prev');
    },
    async focusPane(args) {
      const paneId = args?.paneId as string;
      if (!paneId) return failure('focus.pane', 'Missing paneId argument');
      deps.focusStore.focusPane(paneId);
      return success('focus.pane');
    },
    async focusLock() {
      deps.focusStore.focusLock();
      return success('focus.lock');
    },
    async quietOn() {
      deps.focusStore.quietOn();
      return success('focus.quiet.on');
    },
    async quietOff() {
      deps.focusStore.quietOff();
      return success('focus.quiet.off');
    },
    async focusQueue() {
      deps.focusStore.focusQueue();
      return success('focus.queue');
    },

    // Ghost handlers -- dispatch to VKBUS (never direct mutation)
    async ghostToggle() {
      await deps.vkbusClient.emit('ghost.layer.toggle', {});
      return success('ghost.toggle');
    },
    async ghostPromote() {
      await deps.vkbusClient.emit('ghost.promote.selected', {});
      return success('ghost.promote');
    },
    async ghostDismiss() {
      await deps.vkbusClient.emit('ghost.dismiss.selected', {});
      return success('ghost.dismiss');
    },

    // Navigation handlers
    async showReceipts() {
      deps.navigation.navigate('receipts');
      return success('nav.receipts');
    },
    async showLineage() {
      deps.navigation.navigate('lineage');
      return success('nav.lineage');
    },

    // System handlers
    async inspectViolation() {
      await deps.vkbusClient.emit('violation.inspect', {});
      return success('system.inspect.violation');
    },
  };

  function success(commandId: string): CommandExecutionResult {
    return { success: true, commandId, timestamp: new Date().toISOString() };
  }

  function failure(commandId: string, error: string): CommandExecutionResult {
    return { success: false, commandId, timestamp: new Date().toISOString(), error };
  }

  return {
    async execute(handlerName: string, args?: Record<string, unknown>): Promise<CommandExecutionResult> {
      const handler = handlers[handlerName];
      if (!handler) {
        return failure(handlerName, `Unknown command handler: ${handlerName}`);
      }
      try {
        return await handler(args);
      } catch (err) {
        return failure(handlerName, err instanceof Error ? err.message : 'Unknown error');
      }
    },
  };
}
