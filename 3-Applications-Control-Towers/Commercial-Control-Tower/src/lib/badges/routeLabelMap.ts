export const ROUTE_LABELS: Record<string, { label: string; color: string }> = {
  business_kernel: { label: 'Business', color: 'var(--color-kernel-commercial)' },
  law_kernel: { label: 'Law', color: 'var(--color-kernel-law)' },
  accounting_kernel: { label: 'Accounting', color: 'var(--color-kernel-accounting)' },
  commercial_orchestrator: { label: 'Orchestrator', color: 'var(--color-accent-purple)' },
  voice_assist: { label: 'Voice', color: 'var(--color-voice-active)' },
  language_layer: { label: 'Language', color: 'var(--color-accent-blue)' },
};

export function getRouteLabel(route: string): { label: string; color: string } {
  return ROUTE_LABELS[route] || { label: route, color: 'var(--color-neutral-400)' };
}
