/** Design tokens — Color palette
 * Workstation mode: high clarity, low visual noise
 * No rainbow palette. Professional, subtle, enterprise-grade.
 */
export const colors = {
  // Base
  bg: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F5',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#1A1D21',
    secondary: '#616670',
    tertiary: '#8B8F96',
    inverse: '#FFFFFF',
    link: '#2563EB',
  },
  border: {
    default: '#E5E7EB',
    subtle: '#F1F3F5',
    strong: '#D1D5DB',
    focus: '#2563EB',
  },
  // Kernel Identity Colors (subtle, not loud)
  kernel: {
    business: '#2563EB',     // Professional blue
    law: '#7C3AED',          // Measured purple
    accounting: '#059669',    // Composed green
  },
  // Status
  status: {
    active: '#059669',
    warning: '#D97706',
    critical: '#DC2626',
    info: '#2563EB',
    neutral: '#6B7280',
  },
  // Voice indicators
  voice: {
    idle: '#9CA3AF',
    listening: '#059669',
    processing: '#D97706',
    error: '#DC2626',
  },
} as const;
