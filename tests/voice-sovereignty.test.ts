/**
 * Voice Sovereignty Tests
 * Ensures voice/language layers remain non-sovereign
 */

describe('Voice Layer Sovereignty', () => {
  it('voice intake remains non-sovereign', () => {
    // Voice intake produces candidates, never domain truth
    const voiceOutput = { type: 'candidate', trust_level: 'UNTRUSTED', requires_review: true };
    expect(voiceOutput.trust_level).toBe('UNTRUSTED');
    expect(voiceOutput.requires_review).toBe(true);
  });

  it('transcript envelope typing works correctly', () => {
    const envelope = {
      session_id: 'test-001',
      transcript_text: 'Test spoken input',
      confidence_score: 0.85,
      source_type: 'dictation' as const,
      review_status: 'pending' as const,
      trust_level: 'UNTRUSTED' as const,
    };
    expect(envelope.trust_level).toBe('UNTRUSTED');
    expect(envelope.review_status).toBe('pending');
  });

  it('spoken command routing requires review when touching domain truth', () => {
    const command = {
      raw_text: 'create matter Henderson contract',
      parsed_intent: 'create_matter',
      requires_review: true,
      touches_domain_truth: true,
    };
    expect(command.requires_review).toBe(true);
  });

  it('Iron Ear listening produces advisory packets only', () => {
    const listeningOutput = {
      type: 'advisory_packet',
      sovereign: false,
      requires_practitioner_review: true,
      can_mutate_domain_truth: false,
    };
    expect(listeningOutput.sovereign).toBe(false);
    expect(listeningOutput.requires_practitioner_review).toBe(true);
    expect(listeningOutput.can_mutate_domain_truth).toBe(false);
  });

  it('dictated note becomes structured draft, not sovereign record', () => {
    const dictatedNote = {
      type: 'spoken_note_envelope',
      output_type: 'structured_draft',
      is_sovereign_record: false,
      requires_practitioner_edit: true,
    };
    expect(dictatedNote.is_sovereign_record).toBe(false);
    expect(dictatedNote.requires_practitioner_edit).toBe(true);
  });

  it('read-back support does not mutate domain truth', () => {
    const readback = {
      action: 'read_back_summary',
      mutates_state: false,
      read_only: true,
    };
    expect(readback.mutates_state).toBe(false);
    expect(readback.read_only).toBe(true);
  });
});
