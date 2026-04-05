/**
 * Focus State: Replay Serialization
 *
 * Verifies focus state serializes and deserializes cleanly.
 */

describe('Focus State: Replay Serialization', () => {
  it('should serialize focus state to plain JSON', () => {
    const { serializeFocusState } = require('../src/lib/replay/serializeFocusState');

    const input = {
      primaryPaneId: 'pane-main',
      paneFocusLevels: {
        'pane-main': 'PRIMARY_ACTIVE',
        'pane-side': 'SECONDARY',
        'pane-advisory': 'ADVISORY',
      },
      quietMode: false,
      lockedPaneId: null,
    };

    const serialized = serializeFocusState(input);

    expect(serialized.primaryPaneId).toBe('pane-main');
    expect(serialized.focusLevels['pane-main']).toBe('PRIMARY_ACTIVE');
    expect(serialized.quietMode).toBe(false);
    expect(serialized.lockedPaneId).toBeNull();
  });

  it('should deserialize focus state back to input format', () => {
    const { serializeFocusState, deserializeFocusState } = require('../src/lib/replay/serializeFocusState');

    const input = {
      primaryPaneId: 'pane-1',
      paneFocusLevels: { 'pane-1': 'PRIMARY_ACTIVE', 'pane-2': 'BACKGROUND_AWARE' },
      quietMode: true,
      lockedPaneId: null,
    };

    const serialized = serializeFocusState(input);
    const deserialized = deserializeFocusState(serialized);

    expect(deserialized.primaryPaneId).toBe(input.primaryPaneId);
    expect(deserialized.quietMode).toBe(input.quietMode);
    expect(deserialized.paneFocusLevels['pane-1']).toBe('PRIMARY_ACTIVE');
  });

  it('should produce JSON-serializable output', () => {
    const { serializeFocusState } = require('../src/lib/replay/serializeFocusState');
    const { isSerializable } = require('../src/lib/lineage/replayStateContracts');

    const input = {
      primaryPaneId: 'pane-1',
      paneFocusLevels: new Map([['pane-1', 'PRIMARY_ACTIVE']]),
      quietMode: false,
      lockedPaneId: null,
    };

    const serialized = serializeFocusState(input);
    expect(isSerializable(serialized)).toBe(true);
  });

  it('should serialize Map-based focus levels to plain object', () => {
    const { serializeFocusState } = require('../src/lib/replay/serializeFocusState');

    const input = {
      primaryPaneId: 'p1',
      paneFocusLevels: new Map([
        ['p1', 'PRIMARY_ACTIVE'],
        ['p2', 'SECONDARY'],
      ]),
      quietMode: false,
      lockedPaneId: null,
    };

    const serialized = serializeFocusState(input);
    expect(typeof serialized.focusLevels).toBe('object');
    expect(serialized.focusLevels['p1']).toBe('PRIMARY_ACTIVE');
    expect(serialized.focusLevels['p2']).toBe('SECONDARY');
  });

  it('should validate focus state with errors for invalid data', () => {
    const { validateFocusState } = require('../src/lib/replay/serializeFocusState');

    const invalid = {
      primaryPaneId: '',
      focusLevels: {},
      quietMode: false,
      lockedPaneId: null,
    };

    const result = validateFocusState(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('ghost state should serialize and deserialize cleanly', () => {
    const { serializeGhostState, deserializeGhostState } = require('../src/lib/replay/serializeGhostState');

    const input = {
      visible: true,
      activeProposalIds: ['p1', 'p2'],
      selectedProposalId: 'p1',
    };

    const serialized = serializeGhostState(input);
    const deserialized = deserializeGhostState(serialized);

    expect(deserialized.visible).toBe(true);
    expect(deserialized.activeProposalIds).toEqual(['p1', 'p2']);
    expect(deserialized.selectedProposalId).toBe('p1');
  });

  it('pane layout should serialize and deserialize cleanly', () => {
    const { serializePaneLayout, deserializePaneLayout } = require('../src/lib/replay/serializePaneLayout');

    const panes = [
      { id: 'main', gridArea: 'main', label: 'Main', visible: true },
      { id: 'side', gridArea: 'side', label: 'Side', visible: false },
    ];

    const serialized = serializePaneLayout(panes, 'auto / auto');
    const deserialized = deserializePaneLayout(serialized);

    expect(deserialized.panes).toHaveLength(2);
    expect(deserialized.gridTemplate).toBe('auto / auto');
  });
});
