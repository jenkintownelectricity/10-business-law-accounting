/**
 * Workflow Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Types for workflow steps, tracks, and state management.
 */

import { ID, Timestamp, KernelName, KernelSource, Priority, DomainObject } from './base';

export type WorkflowStepType =
  | 'kernel_evaluation'
  | 'state_transition'
  | 'receipt_emission'
  | 'orchestrator_routing'
  | 'advisory_intake'
  | 'practitioner_review'
  | 'trust_boundary_check'
  | 'decision_bundle_assembly'
  | 'voice_intake_processing'
  | 'language_normalization';

export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped' | 'blocked';

export interface WorkflowStep {
  step_id: ID;
  step_type: WorkflowStepType;
  step_name: string;
  description: string;
  target_kernel: KernelName | 'orchestrator' | null;
  depends_on: ID[];
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: WorkflowStepStatus;
  started_at: Timestamp | null;
  completed_at: Timestamp | null;
  receipt_id: ID | null;
  error: string | null;
  retry_count: number;
  max_retries: number;
}

export type WorkflowTrackType =
  | 'matter_intake'
  | 'matter_review'
  | 'contract_review'
  | 'obligation_tracking'
  | 'financial_assessment'
  | 'decision_bundle'
  | 'voice_intake'
  | 'advisory_review'
  | 'cross_domain_coordination';

export interface WorkflowTrack extends DomainObject {
  track_type: WorkflowTrackType;
  track_name: string;
  description: string;
  matter_id: ID | null;
  steps: WorkflowStep[];
  current_step_id: ID | null;
  priority: Priority;
  assigned_practitioner: string | null;
  target_kernels: KernelName[];
  started_at: Timestamp;
  completed_at: Timestamp | null;
  estimated_completion: Timestamp | null;
  receipt_ids: ID[];
  status: 'pending' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
}

export interface WorkflowState {
  workflow_id: ID;
  matter_id: ID;
  active_tracks: WorkflowTrack[];
  completed_tracks: WorkflowTrack[];
  pending_steps: number;
  in_progress_steps: number;
  completed_steps: number;
  failed_steps: number;
  overall_progress: number;
  last_activity_at: Timestamp;
  status: 'active' | 'idle' | 'blocked' | 'completed';
}
