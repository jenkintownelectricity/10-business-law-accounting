/**
 * Focus: No AI Focus Theft
 *
 * Verifies AI/advisory cannot steal PRIMARY_ACTIVE focus.
 * Only operator-sourced commands can set PRIMARY_ACTIVE.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Focus: No AI Focus Theft', () => {
  it('validateFocusCommand should reject non-operator PRIMARY_ACTIVE changes', () => {
    const { validateFocusCommand } = require('../src/lib/command/focusCommands');

    const aiCommand = {
      type: 'FOCUS_PANE',
      paneId: 'advisory-pane',
      level: 'PRIMARY_ACTIVE',
      source: 'system',
    };

    const result = validateFocusCommand(aiCommand);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Non-operator');
  });

  it('validateFocusCommand should accept operator PRIMARY_ACTIVE changes', () => {
    const { validateFocusCommand } = require('../src/lib/command/focusCommands');

    const operatorCommand = {
      type: 'FOCUS_PANE',
      paneId: 'main-pane',
      level: 'PRIMARY_ACTIVE',
      source: 'operator',
    };

    const result = validateFocusCommand(operatorCommand);
    expect(result.valid).toBe(true);
  });

  it('validateFocusCommand should reject non-operator LOCKED_REVIEW changes', () => {
    const { validateFocusCommand } = require('../src/lib/command/focusCommands');

    const aiLock = {
      type: 'FOCUS_LOCK',
      level: 'LOCKED_REVIEW',
      source: 'system',
    };

    const result = validateFocusCommand(aiLock);
    expect(result.valid).toBe(false);
  });

  it('all focus command factory functions should set source to operator', () => {
    const {
      focusPane,
      focusNext,
      focusPrev,
      focusLock,
      quietOn,
      quietOff,
    } = require('../src/lib/command/focusCommands');

    expect(focusPane('test').source).toBe('operator');
    expect(focusNext().source).toBe('operator');
    expect(focusPrev().source).toBe('operator');
    expect(focusLock().source).toBe('operator');
    expect(quietOn().source).toBe('operator');
    expect(quietOff().source).toBe('operator');
  });

  it('focus label map should describe ADVISORY as unable to steal PRIMARY', () => {
    const { FOCUS_LABEL_MAP } = require('../src/lib/badges/focusLabelMap');

    expect(FOCUS_LABEL_MAP.ADVISORY.description).toContain('Cannot steal PRIMARY');
  });

  it('canReceiveAdvisory should return false for QUIET and LOCKED_REVIEW', () => {
    const { canReceiveAdvisory } = require('../src/lib/badges/focusLabelMap');

    expect(canReceiveAdvisory('QUIET')).toBe(false);
    expect(canReceiveAdvisory('LOCKED_REVIEW')).toBe(false);
    expect(canReceiveAdvisory('PRIMARY_ACTIVE')).toBe(true);
    expect(canReceiveAdvisory('ADVISORY')).toBe(true);
  });
});
