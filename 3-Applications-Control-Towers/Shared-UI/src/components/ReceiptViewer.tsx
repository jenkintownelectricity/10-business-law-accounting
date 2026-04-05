import React from 'react';

interface ReceiptData {
  id: string;
  title: string;
  type: string;
  kernel: 'business' | 'law' | 'accounting';
  timestamp: string;
  sourceDescription: string;
  dataHash: string;
  verified: boolean;
  fields: ReceiptField[];
}

interface ReceiptField {
  label: string;
  value: string;
  type: 'text' | 'currency' | 'date' | 'reference' | 'hash';
}

interface ReceiptViewerProps {
  receipt: ReceiptData;
  expanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

export function ReceiptViewer({
  receipt,
  expanded = false,
  onToggleExpand,
  className = '',
}: ReceiptViewerProps) {
  return (
    <div className={`cct-receipt-viewer ${expanded ? 'cct-receipt-expanded' : ''} ${className}`}>
      <div className="cct-receipt-header" onClick={onToggleExpand} style={{ cursor: onToggleExpand ? 'pointer' : 'default' }}>
        <div className="cct-receipt-header-left">
          <span className={`cct-kernel-tag cct-kernel-${receipt.kernel}`}>{receipt.kernel}</span>
          <span className="cct-receipt-title">{receipt.title}</span>
          <span className="cct-receipt-type">{receipt.type}</span>
        </div>
        <div className="cct-receipt-header-right">
          <span className={`cct-verified-badge ${receipt.verified ? 'cct-verified' : 'cct-unverified'}`}>
            {receipt.verified ? 'Verified' : 'Unverified'}
          </span>
          <span className="cct-receipt-timestamp">{receipt.timestamp}</span>
          {onToggleExpand && (
            <span className="cct-receipt-expand-icon">{expanded ? '\u25BC' : '\u25B6'}</span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="cct-receipt-details">
          <div className="cct-receipt-fields">
            {receipt.fields.map((field, idx) => (
              <div key={idx} className="cct-receipt-field">
                <span className="cct-receipt-field-label">{field.label}</span>
                <span className={`cct-receipt-field-value cct-receipt-field-${field.type}`}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>
          <div className="cct-receipt-footer">
            <div className="cct-receipt-source">
              <span className="cct-receipt-source-label">Source:</span>
              <span className="cct-receipt-source-value">{receipt.sourceDescription}</span>
            </div>
            <div className="cct-receipt-hash">
              <span className="cct-receipt-hash-label">Hash:</span>
              <code className="cct-receipt-hash-value">{receipt.dataHash}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
