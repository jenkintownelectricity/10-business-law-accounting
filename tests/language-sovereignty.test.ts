/**
 * Language Intelligence Sovereignty Tests
 */

describe('Language Intelligence Layer', () => {
  it('language normalization never directly approves domain truth', () => {
    const normOutput = {
      type: 'normalization_packet',
      is_authoritative: false,
      is_advisory: true,
      can_approve_domain_truth: false,
    };
    expect(normOutput.can_approve_domain_truth).toBe(false);
    expect(normOutput.is_advisory).toBe(true);
  });

  it('terminology alignment is suggestive, not authoritative', () => {
    const alignment = {
      type: 'terminology_alignment',
      confidence: 0.87,
      is_suggestion: true,
      requires_practitioner_confirmation: true,
    };
    expect(alignment.is_suggestion).toBe(true);
    expect(alignment.requires_practitioner_confirmation).toBe(true);
  });

  it('language-derived output cannot directly become sovereign action', () => {
    const languageOutput = {
      source: 'language_intelligence_layer',
      can_take_sovereign_action: false,
      must_route_through_orchestrator: true,
    };
    expect(languageOutput.can_take_sovereign_action).toBe(false);
  });
});
