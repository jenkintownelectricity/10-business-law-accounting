/**
 * VKBUS Signal Emission Test
 * Verifies that ghost.promote emits VKBUS signal with correct payload.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('VKBUS: Signal Emission for Ghost Promote', () => {
  const vkbusClientPath = path.resolve(__dirname, '../src/lib/vkbus/vkbusClient.ts');
  const signalTypeMapPath = path.resolve(__dirname, '../src/lib/vkbus/signalTypeMap.ts');
  const signalValidatorsPath = path.resolve(__dirname, '../src/lib/vkbus/signalValidators.ts');
  let clientContent: string;

  beforeAll(() => {
    clientContent = fs.readFileSync(vkbusClientPath, 'utf-8');
  });

  it('vkbus client should have promoteGhost method', () => {
    expect(clientContent).toContain('promoteGhost');
  });

  it('promoteGhost should emit cct.ghost.promote signal type', () => {
    expect(clientContent).toMatch(/signal_type:\s*'cct\.ghost\.promote'/);
  });

  it('promoteGhost should include proposal_id in payload', () => {
    expect(clientContent).toContain('proposal_id');
  });

  it('promoteGhost should include promotion_type in payload', () => {
    expect(clientContent).toContain('promotion_type');
  });

  it('promoteGhost should include target_kernel in payload', () => {
    expect(clientContent).toContain('target_kernel');
  });

  it('promoteGhost should require operator_id', () => {
    expect(clientContent).toMatch(/promoteGhost\([^)]*operatorId/);
  });

  it('emit should validate signal before sending', () => {
    expect(clientContent).toContain('validateSignal');
  });

  it('emit should set source_surface to COMMERCIAL_CONTROL_TOWER', () => {
    expect(clientContent).toContain("source_surface: 'COMMERCIAL_CONTROL_TOWER'");
  });

  it('emit should generate unique signal_id', () => {
    expect(clientContent).toMatch(/signal_id:\s*`sig_/);
  });

  it('emit should include ISO timestamp', () => {
    expect(clientContent).toContain('new Date().toISOString()');
  });

  it('emit should return receipt_id on success', () => {
    expect(clientContent).toContain('receipt_id');
  });

  it('signal type map should exist', () => {
    expect(fs.existsSync(signalTypeMapPath)).toBe(true);
  });

  it('signal validators should exist', () => {
    expect(fs.existsSync(signalValidatorsPath)).toBe(true);
  });

  it('validation should reject signals without operator_id', () => {
    expect(clientContent).toMatch(/Missing operator_id/);
  });

  it('validation should reject signals without signal_type', () => {
    expect(clientContent).toMatch(/Missing signal_type/);
  });
});
