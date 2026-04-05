export type ConstraintResult = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface ConstraintEvaluation {
  constraint_id: string;
  constraint_name: string;
  result: ConstraintResult;
  message: string;
  evaluated_at: string;
}

export function evaluateUnsignedContract(signed: boolean): ConstraintEvaluation {
  return {
    constraint_id: 'LAW-001',
    constraint_name: 'unsigned-contract',
    result: signed ? 'PASS' : 'HALT',
    message: signed ? 'Contract is signed' : 'Contract has not been signed',
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateUnreviewedObligation(obligations: { reviewed: boolean }[]): ConstraintEvaluation {
  const unreviewed = obligations.filter(o => !o.reviewed);
  if (unreviewed.length === 0) {
    return { constraint_id: 'LAW-002', constraint_name: 'unreviewed-obligation', result: 'PASS', message: 'All obligations reviewed', evaluated_at: new Date().toISOString() };
  }
  return {
    constraint_id: 'LAW-002',
    constraint_name: 'unreviewed-obligation',
    result: unreviewed.length > 2 ? 'HALT' : 'WARNING',
    message: `${unreviewed.length} obligation(s) unreviewed`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateMissingEvidence(evidenceItems: { verified: boolean }[]): ConstraintEvaluation {
  if (evidenceItems.length === 0) {
    return { constraint_id: 'LAW-003', constraint_name: 'missing-evidence', result: 'HALT', message: 'No evidence items present', evaluated_at: new Date().toISOString() };
  }
  const unverified = evidenceItems.filter(e => !e.verified);
  if (unverified.length === 0) {
    return { constraint_id: 'LAW-003', constraint_name: 'missing-evidence', result: 'PASS', message: 'All evidence verified', evaluated_at: new Date().toISOString() };
  }
  return { constraint_id: 'LAW-003', constraint_name: 'missing-evidence', result: 'WARNING', message: `${unverified.length} evidence item(s) unverified`, evaluated_at: new Date().toISOString() };
}

export function evaluateExpiredDeadline(dueDate: string | undefined): ConstraintEvaluation {
  if (!dueDate) {
    return { constraint_id: 'LAW-004', constraint_name: 'expired-deadline', result: 'WARNING', message: 'No deadline set', evaluated_at: new Date().toISOString() };
  }
  const now = new Date();
  const deadline = new Date(dueDate);
  const expired = deadline < now;
  return {
    constraint_id: 'LAW-004',
    constraint_name: 'expired-deadline',
    result: expired ? 'HALT' : 'PASS',
    message: expired ? `Deadline expired: ${dueDate}` : `Deadline active: ${dueDate}`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateIncompletePartyIdentification(parties: { identified: boolean }[]): ConstraintEvaluation {
  const unidentified = parties.filter(p => !p.identified);
  if (unidentified.length === 0) {
    return { constraint_id: 'LAW-005', constraint_name: 'incomplete-party-identification', result: 'PASS', message: 'All parties identified', evaluated_at: new Date().toISOString() };
  }
  return {
    constraint_id: 'LAW-005',
    constraint_name: 'incomplete-party-identification',
    result: 'HALT',
    message: `${unidentified.length} party/parties not identified`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateUnassessedLegalRisk(risks: { assessed: boolean }[]): ConstraintEvaluation {
  const unassessed = risks.filter(r => !r.assessed);
  if (unassessed.length === 0) {
    return { constraint_id: 'LAW-006', constraint_name: 'unassessed-legal-risk', result: 'PASS', message: 'All legal risks assessed', evaluated_at: new Date().toISOString() };
  }
  return {
    constraint_id: 'LAW-006',
    constraint_name: 'unassessed-legal-risk',
    result: unassessed.length > 1 ? 'HALT' : 'WARNING',
    message: `${unassessed.length} legal risk(s) unassessed`,
    evaluated_at: new Date().toISOString(),
  };
}
