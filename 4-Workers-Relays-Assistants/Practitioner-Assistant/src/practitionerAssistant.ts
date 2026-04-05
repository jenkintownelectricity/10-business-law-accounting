/**
 * Practitioner-Assistant
 *
 * AI-assisted practitioner support. Non-sovereign, advisory only.
 * All assistant outputs are advisory and non-sovereign.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MatterSummary {
  matter_id: string;
  summary: string;
  status: string;
  kernel_assessments: string[];
  open_items: number;
  is_advisory: true;
  generated_at: string;
}

export interface MissingInput {
  field: string;
  description: string;
  required_by: string;
  severity: 'blocking' | 'important' | 'optional';
}

export interface MissingInputsReport {
  matter_id: string;
  missing_inputs: MissingInput[];
  completeness_score: number;
  is_advisory: true;
  generated_at: string;
}

export interface OpenLoop {
  domain: 'legal' | 'accounting' | 'business';
  description: string;
  status: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface OpenLoopsReport {
  matter_id: string;
  open_loops: OpenLoop[];
  is_advisory: true;
  generated_at: string;
}

export interface DraftReviewPacket {
  matter_id: string;
  sections: { title: string; content: string }[];
  is_draft: true;
  is_advisory: true;
  generated_at: string;
}

export interface TaskRecommendation {
  matter_id: string;
  recommended_task: string;
  reasoning: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimated_effort: string;
  is_advisory: true;
  generated_at: string;
}

export interface WorkOrganization {
  practitioner_id: string;
  organized_matters: {
    matter_id: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    next_deadline?: string;
    recommended_action: string;
  }[];
  is_advisory: true;
  generated_at: string;
}

export interface SpokenPromptResult {
  original_transcript: string;
  interpreted_intent: string;
  actionable_candidate: string;
  confidence: number;
  requires_confirmation: true;
  is_advisory: true;
  generated_at: string;
}

export interface ReadBackSummary {
  matter_id: string;
  read_back_text: string;
  is_advisory: true;
  generated_at: string;
}

export interface DictatedNoteRouting {
  note_text: string;
  suggested_target: string;
  suggested_matter_id?: string;
  suggested_category: string;
  confidence: number;
  is_advisory: true;
  generated_at: string;
}

// ---------------------------------------------------------------------------
// Simulated data access (placeholder for real kernel integration)
// ---------------------------------------------------------------------------

interface MatterData {
  matter_id: string;
  status: string;
  client_name: string;
  matter_type: string;
  description: string;
  urgency: string;
  kernel_assessments: string[];
  obligations: { description: string; deadline?: string; status: string }[];
  financial_events: { description: string; amount: number; status: string }[];
  follow_up_actions: { description: string; priority: string; status: string; deadline?: string }[];
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class PractitionerAssistant {
  private matterDataStore: Map<string, MatterData> = new Map();

  /**
   * Register matter data for the assistant to reference.
   * In production, this would connect to actual kernel state stores.
   */
  registerMatterData(data: MatterData): void {
    this.matterDataStore.set(data.matter_id, data);
  }

  /**
   * Produce a matter summary. Advisory only.
   */
  summarizeMatter(matterId: string): MatterSummary {
    const data = this.matterDataStore.get(matterId);
    const now = new Date().toISOString();

    if (!data) {
      return {
        matter_id: matterId,
        summary: `No data available for matter ${matterId}.`,
        status: 'unknown',
        kernel_assessments: [],
        open_items: 0,
        is_advisory: true,
        generated_at: now,
      };
    }

    const openObligations = data.obligations.filter((o) => o.status !== 'fulfilled').length;
    const pendingActions = data.follow_up_actions.filter((a) => a.status === 'pending').length;

    return {
      matter_id: matterId,
      summary: `Matter for ${data.client_name} (${data.matter_type}): ${data.description}. Status: ${data.status}. ${openObligations} open obligation(s), ${pendingActions} pending action(s).`,
      status: data.status,
      kernel_assessments: data.kernel_assessments,
      open_items: openObligations + pendingActions,
      is_advisory: true,
      generated_at: now,
    };
  }

  /**
   * Identify incomplete data. Advisory only.
   */
  highlightMissingInputs(matterId: string): MissingInputsReport {
    const data = this.matterDataStore.get(matterId);
    const now = new Date().toISOString();
    const missing: MissingInput[] = [];

    if (!data) {
      missing.push({
        field: 'matter_data',
        description: 'No matter data found',
        required_by: 'system',
        severity: 'blocking',
      });
      return { matter_id: matterId, missing_inputs: missing, completeness_score: 0, is_advisory: true, generated_at: now };
    }

    if (!data.client_name) missing.push({ field: 'client_name', description: 'Client name missing', required_by: 'intake', severity: 'blocking' });
    if (!data.description || data.description.length < 10) missing.push({ field: 'description', description: 'Description insufficient', required_by: 'intake', severity: 'important' });
    if (data.kernel_assessments.length === 0) missing.push({ field: 'kernel_assessments', description: 'No kernel assessments recorded', required_by: 'orchestration', severity: 'important' });
    if (data.obligations.length === 0) missing.push({ field: 'obligations', description: 'No obligations extracted', required_by: 'law_kernel', severity: 'optional' });

    const totalFields = 4;
    const completeness = (totalFields - missing.length) / totalFields;

    return { matter_id: matterId, missing_inputs: missing, completeness_score: completeness, is_advisory: true, generated_at: now };
  }

  /**
   * List unresolved legal/accounting/business items. Advisory only.
   */
  showOpenLoops(matterId: string): OpenLoopsReport {
    const data = this.matterDataStore.get(matterId);
    const now = new Date().toISOString();
    const loops: OpenLoop[] = [];

    if (data) {
      for (const obligation of data.obligations.filter((o) => o.status !== 'fulfilled')) {
        loops.push({
          domain: 'legal',
          description: obligation.description,
          status: obligation.status,
          priority: obligation.deadline ? 'high' : 'medium',
        });
      }

      for (const event of data.financial_events.filter((e) => e.status !== 'reconciled')) {
        loops.push({
          domain: 'accounting',
          description: event.description,
          status: event.status,
          priority: 'medium',
        });
      }

      for (const action of data.follow_up_actions.filter((a) => a.status === 'pending')) {
        loops.push({
          domain: 'business',
          description: action.description,
          status: action.status,
          priority: action.priority as OpenLoop['priority'],
        });
      }
    }

    return { matter_id: matterId, open_loops: loops, is_advisory: true, generated_at: now };
  }

  /**
   * Create draft review packet. Advisory only.
   */
  prepareDraftReviewPacket(matterId: string): DraftReviewPacket {
    const data = this.matterDataStore.get(matterId);
    const now = new Date().toISOString();
    const sections: { title: string; content: string }[] = [];

    if (data) {
      sections.push({ title: 'Overview', content: `${data.matter_type} matter for ${data.client_name}. ${data.description}` });
      sections.push({ title: 'Status', content: `Current status: ${data.status}. Urgency: ${data.urgency}.` });
      sections.push({ title: 'Obligations', content: data.obligations.map((o) => `- ${o.description} (${o.status})`).join('\n') || 'None identified.' });
      sections.push({ title: 'Financial Events', content: data.financial_events.map((e) => `- ${e.description}: $${e.amount} (${e.status})`).join('\n') || 'None recorded.' });
      sections.push({ title: 'Follow-Up Actions', content: data.follow_up_actions.map((a) => `- [${a.priority}] ${a.description} (${a.status})`).join('\n') || 'None pending.' });
    } else {
      sections.push({ title: 'Overview', content: `No data available for matter ${matterId}.` });
    }

    return { matter_id: matterId, sections, is_draft: true, is_advisory: true, generated_at: now };
  }

  /**
   * Suggest next action. Advisory only.
   */
  recommendNextTask(matterId: string): TaskRecommendation {
    const data = this.matterDataStore.get(matterId);
    const now = new Date().toISOString();

    if (!data) {
      return {
        matter_id: matterId,
        recommended_task: 'Gather matter data',
        reasoning: 'No matter data available — initial data collection needed.',
        priority: 'high',
        estimated_effort: '30 minutes',
        is_advisory: true,
        generated_at: now,
      };
    }

    // Priority: urgent deadlines > pending actions > missing assessments
    const urgentObligations = data.obligations.filter((o) => o.deadline && o.status !== 'fulfilled');
    if (urgentObligations.length > 0) {
      return {
        matter_id: matterId,
        recommended_task: `Address obligation: ${urgentObligations[0].description}`,
        reasoning: `Obligation has deadline ${urgentObligations[0].deadline} and is ${urgentObligations[0].status}.`,
        priority: 'high',
        estimated_effort: '1 hour',
        is_advisory: true,
        generated_at: now,
      };
    }

    const pendingActions = data.follow_up_actions.filter((a) => a.status === 'pending');
    if (pendingActions.length > 0) {
      return {
        matter_id: matterId,
        recommended_task: pendingActions[0].description,
        reasoning: `${pendingActions.length} follow-up action(s) pending.`,
        priority: pendingActions[0].priority as TaskRecommendation['priority'],
        estimated_effort: '30 minutes',
        is_advisory: true,
        generated_at: now,
      };
    }

    return {
      matter_id: matterId,
      recommended_task: 'Review matter for completeness',
      reasoning: 'No urgent items identified — periodic review recommended.',
      priority: 'low',
      estimated_effort: '15 minutes',
      is_advisory: true,
      generated_at: now,
    };
  }

  /**
   * Sort matters by priority/deadline. Advisory only.
   */
  organizeWork(practitionerId: string): WorkOrganization {
    const now = new Date().toISOString();
    const organized: WorkOrganization['organized_matters'] = [];

    for (const [matterId, data] of this.matterDataStore) {
      const nextDeadline = data.obligations
        .filter((o) => o.deadline && o.status !== 'fulfilled')
        .map((o) => o.deadline!)
        .sort()[0];

      const pendingActions = data.follow_up_actions.filter((a) => a.status === 'pending');

      organized.push({
        matter_id: matterId,
        priority: data.urgency as 'critical' | 'high' | 'medium' | 'low',
        next_deadline: nextDeadline,
        recommended_action: pendingActions.length > 0
          ? pendingActions[0].description
          : 'Review for completeness',
      });
    }

    // Sort by priority, then by deadline
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    organized.sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
      if (pDiff !== 0) return pDiff;
      if (a.next_deadline && b.next_deadline) return a.next_deadline.localeCompare(b.next_deadline);
      if (a.next_deadline) return -1;
      if (b.next_deadline) return 1;
      return 0;
    });

    return { practitioner_id: practitionerId, organized_matters: organized, is_advisory: true, generated_at: now };
  }

  /**
   * Process spoken request into actionable candidate. Advisory only.
   */
  acceptSpokenPrompt(transcript: string): SpokenPromptResult {
    const now = new Date().toISOString();
    const lower = transcript.toLowerCase();

    let intent = 'unknown';
    let actionable = transcript;

    if (lower.includes('summarize') || lower.includes('summary')) {
      intent = 'summarize_matter';
      actionable = `Generate summary for referenced matter`;
    } else if (lower.includes('deadline') || lower.includes('due')) {
      intent = 'check_deadlines';
      actionable = `Check upcoming deadlines`;
    } else if (lower.includes('review')) {
      intent = 'prepare_review';
      actionable = `Prepare review packet for referenced matter`;
    } else if (lower.includes('note') || lower.includes('memo')) {
      intent = 'create_note';
      actionable = `Create note: ${transcript}`;
    }

    return {
      original_transcript: transcript,
      interpreted_intent: intent,
      actionable_candidate: actionable,
      confidence: intent !== 'unknown' ? 0.7 : 0.3,
      requires_confirmation: true,
      is_advisory: true,
      generated_at: now,
    };
  }

  /**
   * Produce text for read-back. Advisory only.
   */
  readBackSummary(matterId: string): ReadBackSummary {
    const summary = this.summarizeMatter(matterId);
    return {
      matter_id: matterId,
      read_back_text: summary.summary,
      is_advisory: true,
      generated_at: new Date().toISOString(),
    };
  }

  /**
   * Route dictated note to structured draft. Advisory only.
   */
  routeDictatedNote(spokenNote: string): DictatedNoteRouting {
    const now = new Date().toISOString();
    const lower = spokenNote.toLowerCase();

    let target = 'general_notes';
    let category = 'uncategorized';

    if (lower.includes('contract') || lower.includes('agreement')) {
      target = 'contract_notes';
      category = 'legal';
    } else if (lower.includes('invoice') || lower.includes('payment') || lower.includes('billing')) {
      target = 'accounting_notes';
      category = 'accounting';
    } else if (lower.includes('client') || lower.includes('meeting') || lower.includes('strategy')) {
      target = 'business_notes';
      category = 'business';
    }

    return {
      note_text: spokenNote,
      suggested_target: target,
      suggested_category: category,
      confidence: category !== 'uncategorized' ? 0.65 : 0.3,
      is_advisory: true,
      generated_at: now,
    };
  }
}
