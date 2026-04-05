// ──────────────────────────────────────────────────────────────
//  Domain Object: Deadline
//  Tracks time-sensitive obligations from contracts, obligations,
//  matters, and regulatory requirements.
// ──────────────────────────────────────────────────────────────

import type { Priority } from './matter.js';

export type DeadlineSource = 'contract' | 'obligation' | 'matter' | 'regulation' | 'court_order' | 'manual';

export type DeadlineStatus =
  | 'upcoming'
  | 'imminent'
  | 'due_today'
  | 'overdue'
  | 'completed'
  | 'waived'
  | 'extended'
  | 'cancelled';

export type Criticality = 'absolute' | 'statutory' | 'contractual' | 'operational' | 'advisory';

export interface ReminderSchedule {
  reminder_id: string;
  trigger_days_before: number;
  trigger_date: string;
  channels: ('dashboard' | 'email' | 'sms' | 'push' | 'signal')[];
  sent: boolean;
  sent_at?: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
}

export interface DeadlineExtension {
  id: string;
  original_due_date: string;
  new_due_date: string;
  reason: string;
  approved_by: string;
  approved_at: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  source_type: DeadlineSource;
  source_id: string;
  matter_id?: string;
  due_date: string;
  due_time?: string;
  timezone: string;
  status: DeadlineStatus;
  criticality: Criticality;
  priority: Priority;
  reminder_schedule: ReminderSchedule[];
  extensions: DeadlineExtension[];
  assigned_to?: string;
  assigned_kernel?: 'business' | 'law' | 'accounting';
  consequence_of_miss: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  completed_at?: string;
  completed_by?: string;
}
