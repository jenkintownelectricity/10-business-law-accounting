import React from 'react';

interface FormSurfaceProps {
  title?: string;
  description?: string;
  onSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

interface FormGroupProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface FormRowProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function FormSurface({
  title,
  description,
  onSubmit,
  children,
  actions,
  className = '',
}: FormSurfaceProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className={`cct-form-surface ${className}`} onSubmit={handleSubmit}>
      {(title || description) && (
        <div className="cct-form-surface-header">
          {title && <h3 className="cct-form-surface-title">{title}</h3>}
          {description && <p className="cct-form-surface-description">{description}</p>}
        </div>
      )}
      <div className="cct-form-surface-body">
        {children}
      </div>
      {actions && (
        <div className="cct-form-surface-actions">
          {actions}
        </div>
      )}
    </form>
  );
}

export function FormGroup({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
}: FormGroupProps) {
  return (
    <div className={`cct-form-group ${error ? 'cct-form-group-error' : ''}`}>
      <label className="cct-form-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="cct-form-required">*</span>}
      </label>
      {children}
      {hint && !error && <p className="cct-form-hint">{hint}</p>}
      {error && <p className="cct-form-error">{error}</p>}
    </div>
  );
}

export function FormRow({ columns = 2, children }: FormRowProps) {
  return (
    <div className={`cct-form-row cct-form-row-${columns}`}>
      {children}
    </div>
  );
}
