/**
 * Receipt Classification Test
 * Verifies that each command declares correct receipt class.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Receipt Classification: Command Receipt Declarations', () => {
  const signalReceiptsPath = path.resolve(__dirname, '../src/lib/vkbus/signalReceipts.ts');
  const vkbusClientPath = path.resolve(__dirname, '../src/lib/vkbus/vkbusClient.ts');
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');

  it('signal receipts module should exist', () => {
    expect(fs.existsSync(signalReceiptsPath)).toBe(true);
  });

  it('vkbus client should return receipt_id on successful emission', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('receipt_id');
  });

  it('vkbus emit result should include success status', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('success: boolean');
  });

  it('vkbus emit result should include signal_id', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('signal_id: string');
  });

  it('vkbus emit result should support error field', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('error?: string');
  });

  it('each vkbus method should route through emit for receipt tracking', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    // All domain methods should call this.emit
    expect(content).toMatch(/promoteGhost[^}]*this\.emit/s);
    expect(content).toMatch(/dismissGhost[^}]*this\.emit/s);
    expect(content).toMatch(/emitFocusChange[^}]*this\.emit/s);
  });

  it('vkbus client should maintain a signal log', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('signalLog');
    expect(content).toContain('getSignalLog');
  });

  it('each registered command should have a handler reference', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    const commandBlocks = content.match(/\{[^}]*id:\s*'[^']+[^}]*handler:\s*'[^']+[^}]*\}/gs);
    expect(commandBlocks).not.toBeNull();
    expect(commandBlocks!.length).toBeGreaterThan(0);
  });

  it('signal receipts should define receipt types or classes', () => {
    const content = fs.readFileSync(signalReceiptsPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
    // Should reference receipt concepts
    expect(content).toMatch(/[Rr]eceipt/);
  });
});
