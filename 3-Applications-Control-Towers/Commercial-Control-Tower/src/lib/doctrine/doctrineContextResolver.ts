/**
 * Resolves which doctrine entry is contextually relevant
 * given the current active pane and entity.
 */

export function resolveDoctrineContext(
  activePaneType: string | null,
  activeEntityType: string | null,
): { suggestedDoctrineId: string; breadcrumb: string[] } {
  if (activePaneType === 'matter' || activeEntityType === 'matter') {
    return { suggestedDoctrineId: 'commercial-orchestration-v1', breadcrumb: ['Commercial Orchestration', 'Matter Lifecycle'] };
  }
  if (activePaneType === 'contract' || activeEntityType === 'contract') {
    return { suggestedDoctrineId: 'kernel-stack-v1', breadcrumb: ['Kernel Stack', 'Law Kernel', 'Contracts'] };
  }
  if (activePaneType === 'accounting' || activeEntityType === 'invoice') {
    return { suggestedDoctrineId: 'kernel-stack-v1', breadcrumb: ['Kernel Stack', 'Accounting Kernel'] };
  }
  if (activePaneType === 'voice' || activePaneType === 'listening') {
    return { suggestedDoctrineId: 'voice-language-v1', breadcrumb: ['Voice & Language', 'Augmentation Posture'] };
  }
  return { suggestedDoctrineId: 'root-v1', breadcrumb: ['Domain Root'] };
}
