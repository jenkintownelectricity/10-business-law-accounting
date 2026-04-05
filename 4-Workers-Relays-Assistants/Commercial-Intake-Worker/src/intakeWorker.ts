/**
 * Commercial-Intake-Worker
 *
 * Processes intake: validates matter data, evaluates intake constraints,
 * routes to appropriate kernel(s), creates matter record in INTAKE status.
 * Handles both manual and voice-originated intake (voice intake always
 * goes through review queue).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IntakeSource = 'manual' | 'voice' | 'api';

export type KernelTarget = 'business' | 'law' | 'accounting';

export interface IntakeRequest {
  source: IntakeSource;
  client_name: string;
  matter_type: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  metadata?: Record<string, unknown>;
  voice_session_id?: string;
}

export interface IntakeConstraintResult {
  passed: boolean;
  constraint_name: string;
  message: string;
}

export interface IntakeResult {
  matter_id: string;
  status: 'INTAKE';
  source: IntakeSource;
  kernel_targets: KernelTarget[];
  requires_review: boolean;
  constraint_results: IntakeConstraintResult[];
  created_at: string;
  receipt_id: string;
}

export interface IntakeReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'commercial_intake';
  source_kernel: 'orchestrator';
  entity_type: 'matter';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Constraint evaluation
// ---------------------------------------------------------------------------

function evaluateIntakeConstraints(request: IntakeRequest): IntakeConstraintResult[] {
  const results: IntakeConstraintResult[] = [];

  // Constraint: client name is required
  results.push({
    passed: request.client_name.trim().length > 0,
    constraint_name: 'client_name_required',
    message: request.client_name.trim().length > 0
      ? 'Client name provided'
      : 'Client name is required',
  });

  // Constraint: matter type is required
  results.push({
    passed: request.matter_type.trim().length > 0,
    constraint_name: 'matter_type_required',
    message: request.matter_type.trim().length > 0
      ? 'Matter type provided'
      : 'Matter type is required',
  });

  // Constraint: description minimum length
  const descMinLength = 10;
  results.push({
    passed: request.description.trim().length >= descMinLength,
    constraint_name: 'description_minimum_length',
    message: request.description.trim().length >= descMinLength
      ? 'Description meets minimum length'
      : `Description must be at least ${descMinLength} characters`,
  });

  // Constraint: voice intake must have session id
  if (request.source === 'voice') {
    results.push({
      passed: !!request.voice_session_id,
      constraint_name: 'voice_session_id_required',
      message: request.voice_session_id
        ? 'Voice session ID provided'
        : 'Voice intake requires a voice_session_id',
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Kernel routing
// ---------------------------------------------------------------------------

function determineKernelTargets(request: IntakeRequest): KernelTarget[] {
  const targets: KernelTarget[] = [];
  const matterType = request.matter_type.toLowerCase();

  // Business kernel for all commercial matters
  targets.push('business');

  // Law kernel for legal-related matters
  const legalKeywords = ['contract', 'litigation', 'compliance', 'regulatory', 'dispute', 'legal', 'obligation'];
  if (legalKeywords.some((kw) => matterType.includes(kw) || request.description.toLowerCase().includes(kw))) {
    targets.push('law');
  }

  // Accounting kernel for financial-related matters
  const accountingKeywords = ['invoice', 'payment', 'tax', 'financial', 'accounting', 'billing', 'ledger', 'reconciliation'];
  if (accountingKeywords.some((kw) => matterType.includes(kw) || request.description.toLowerCase().includes(kw))) {
    targets.push('accounting');
  }

  return targets;
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class CommercialIntakeWorker {
  private receipts: IntakeReceipt[] = [];

  /**
   * Process an intake request. Validates, evaluates constraints, determines
   * kernel routing, and creates a matter record in INTAKE status.
   */
  async processIntake(request: IntakeRequest): Promise<IntakeResult> {
    // 1. Evaluate constraints
    const constraintResults = evaluateIntakeConstraints(request);
    const allPassed = constraintResults.every((c) => c.passed);

    if (!allPassed) {
      const failures = constraintResults.filter((c) => !c.passed);
      throw new Error(
        `Intake constraint violations: ${failures.map((f) => f.message).join('; ')}`,
      );
    }

    // 2. Determine kernel targets
    const kernelTargets = determineKernelTargets(request);

    // 3. Voice intake always requires review
    const requiresReview = request.source === 'voice';

    // 4. Create matter record
    const matterId = generateId('MTR');
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');

    // 5. Emit receipt
    const receipt: IntakeReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'commercial_intake',
      source_kernel: 'orchestrator',
      entity_type: 'matter',
      entity_id: matterId,
      details: {
        source: request.source,
        client_name: request.client_name,
        matter_type: request.matter_type,
        urgency: request.urgency,
        kernel_targets: kernelTargets,
        requires_review: requiresReview,
        voice_session_id: request.voice_session_id ?? null,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    // 6. Return result
    return {
      matter_id: matterId,
      status: 'INTAKE',
      source: request.source,
      kernel_targets: kernelTargets,
      requires_review: requiresReview,
      constraint_results: constraintResults,
      created_at: now,
      receipt_id: receiptId,
    };
  }

  /**
   * Validate intake data without processing.
   */
  validateIntake(request: IntakeRequest): IntakeConstraintResult[] {
    return evaluateIntakeConstraints(request);
  }

  /**
   * Get all receipts emitted by this worker.
   */
  getReceipts(): IntakeReceipt[] {
    return [...this.receipts];
  }
}
