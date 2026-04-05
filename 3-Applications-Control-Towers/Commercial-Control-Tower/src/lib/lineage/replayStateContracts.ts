/**
 * Replay State Contracts
 *
 * Defines what must be serializable for replay and what can be reconstructed.
 * Replay-safe state is a strict subset of full application state.
 */

/**
 * SerializableState: must be JSON-serializable, no functions, no DOM refs.
 * This is the contract for anything that enters the replay log.
 */
export interface SerializableReplayState {
  /** Unique replay frame identifier */
  frameId: string;

  /** ISO timestamp of the frame capture */
  timestamp: string;

  /** Pane layout configuration (grid areas, sizes) */
  paneLayout: SerializablePaneLayout;

  /** Focus state at time of capture */
  focusState: SerializableFocusState;

  /** Ghost layer state at time of capture */
  ghostState: SerializableGhostState;

  /** Active receipt IDs (full receipts reconstructed from receipt store) */
  activeReceiptIds: string[];

  /** Attention queue state */
  queueState: SerializableQueueState;
}

export interface SerializablePaneLayout {
  panes: Array<{
    id: string;
    gridArea: string;
    label: string;
    visible: boolean;
  }>;
  gridTemplate: string;
}

export interface SerializableFocusState {
  primaryPaneId: string;
  focusLevels: Record<string, string>;
  quietMode: boolean;
  lockedPaneId: string | null;
}

export interface SerializableGhostState {
  visible: boolean;
  activeProposalIds: string[];
  selectedProposalId: string | null;
}

export interface SerializableQueueState {
  items: Array<{
    id: string;
    type: 'advisory' | 'interruption';
    sourceId: string;
    timestamp: string;
    priority: number;
  }>;
}

/**
 * Reconstructable state: can be derived from serializable state + current stores.
 * These do NOT need to be serialized.
 */
export interface ReconstructableState {
  /** Full receipt objects (reconstructed from receipt store by ID) */
  receipts: unknown[];

  /** Rendered component tree (reconstructed from pane config) */
  componentTree: unknown;

  /** DOM measurements (reconstructed from layout) */
  measurements: unknown;

  /** Animation state (reconstructed or reset) */
  animations: unknown;
}

/**
 * Validates that a state object conforms to serializable contract.
 */
export function isSerializable(value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    const deserialized = JSON.parse(serialized);
    return JSON.stringify(deserialized) === serialized;
  } catch {
    return false;
  }
}

/**
 * Creates an empty replay frame for initialization.
 */
export function createEmptyReplayFrame(frameId: string): SerializableReplayState {
  return {
    frameId,
    timestamp: new Date().toISOString(),
    paneLayout: { panes: [], gridTemplate: '' },
    focusState: {
      primaryPaneId: '',
      focusLevels: {},
      quietMode: false,
      lockedPaneId: null,
    },
    ghostState: {
      visible: false,
      activeProposalIds: [],
      selectedProposalId: null,
    },
    activeReceiptIds: [],
    queueState: { items: [] },
  };
}
