/**
 * Platform Capability Map
 * Domain: Business Law Accounting
 *
 * Maps platform capabilities provided by 30-validkernel-platform
 * to their usage within the Business Law Accounting domain.
 */

// --- Capability Definition ---

export interface PlatformCapability {
  readonly available: boolean;
  readonly used: boolean;
  readonly description: string;
}

// --- Capability Map ---

export const PLATFORM_CAPABILITY_MAP = {
  trustBoundary: { available: true, used: true, description: 'Trust-boundary evaluation for domain ingress/egress' },
  typedPromotion: { available: true, used: true, description: 'Typed promotion for trust level changes' },
  receiptEmission: { available: true, used: true, description: 'Receipt emission for domain state changes' },
  replayFoundation: { available: true, used: false, description: 'Replay foundations — reserved for future use' },
  apiRuntime: { available: true, used: true, description: 'Shared API runtime patterns' },
  adapterContracts: { available: true, used: true, description: 'Shared adapter contract definitions' }
} as const;

// --- Capability Type ---

export type PlatformCapabilityName = keyof typeof PLATFORM_CAPABILITY_MAP;

// --- Capability Queries ---

/**
 * Get all capabilities that are available from the platform.
 */
export function getAvailableCapabilities(): PlatformCapabilityName[] {
  return (Object.keys(PLATFORM_CAPABILITY_MAP) as PlatformCapabilityName[])
    .filter(key => PLATFORM_CAPABILITY_MAP[key].available);
}

/**
 * Get all capabilities that are actively used by the domain.
 */
export function getUsedCapabilities(): PlatformCapabilityName[] {
  return (Object.keys(PLATFORM_CAPABILITY_MAP) as PlatformCapabilityName[])
    .filter(key => PLATFORM_CAPABILITY_MAP[key].used);
}

/**
 * Get capabilities that are available but not yet used (reserved).
 */
export function getReservedCapabilities(): PlatformCapabilityName[] {
  return (Object.keys(PLATFORM_CAPABILITY_MAP) as PlatformCapabilityName[])
    .filter(key => PLATFORM_CAPABILITY_MAP[key].available && !PLATFORM_CAPABILITY_MAP[key].used);
}

/**
 * Check if a specific capability is available and used.
 */
export function isCapabilityActive(name: PlatformCapabilityName): boolean {
  const cap = PLATFORM_CAPABILITY_MAP[name];
  return cap.available && cap.used;
}

/**
 * Get a summary report of platform capability usage.
 */
export function getCapabilitySummary(): {
  total: number;
  available: number;
  used: number;
  reserved: number;
} {
  const all = Object.keys(PLATFORM_CAPABILITY_MAP) as PlatformCapabilityName[];
  return {
    total: all.length,
    available: getAvailableCapabilities().length,
    used: getUsedCapabilities().length,
    reserved: getReservedCapabilities().length
  };
}
