import React from 'react';

type Kernel = 'business' | 'law' | 'accounting';

interface KernelTagProps {
  kernel: Kernel;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const KERNEL_LABELS: Record<Kernel, string> = {
  business: 'Business',
  law: 'Law',
  accounting: 'Accounting',
};

const KERNEL_SHORT: Record<Kernel, string> = {
  business: 'BUS',
  law: 'LAW',
  accounting: 'ACC',
};

export function KernelTag({ kernel, size = 'md', showLabel = true, className = '' }: KernelTagProps) {
  return (
    <span
      className={[
        'cct-kernel-tag',
        `cct-kernel-${kernel}`,
        size === 'sm' ? 'cct-kernel-tag-sm' : '',
        className,
      ].filter(Boolean).join(' ')}
      title={KERNEL_LABELS[kernel]}
    >
      {showLabel ? KERNEL_LABELS[kernel] : KERNEL_SHORT[kernel]}
    </span>
  );
}

interface KernelTagGroupProps {
  kernels: Kernel[];
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function KernelTagGroup({ kernels, size = 'md', showLabel = true, className = '' }: KernelTagGroupProps) {
  return (
    <div className={`cct-kernel-tags ${className}`}>
      {kernels.map(k => (
        <KernelTag key={k} kernel={k} size={size} showLabel={showLabel} />
      ))}
    </div>
  );
}
