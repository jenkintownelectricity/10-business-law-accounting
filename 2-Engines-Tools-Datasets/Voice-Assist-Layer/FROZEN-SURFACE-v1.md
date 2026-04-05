# Voice Assist Layer — Frozen Surface v1

FROZEN — v1

## Role
NON-SOVEREIGN — Advisory input layer for voice-based intake.

## Owned Types
- VoiceSession
- SpokenCommandCandidate
- SpokenNoteEnvelope
- ListeningSession
- TranscriptEnvelope
- MeetingIntakePacket

## Capabilities
- startSession()
- pauseSession()
- resumeSession()
- stopSession()
- parseSpokenCommand()
- startListening()
- stopListening()

## Trust Boundary
The Voice Assist Layer produces advisory output only.
It cannot modify domain truth or execute commands.
All output must be routed through the Commercial Orchestrator review queue.
Spoken commands produce SpokenCommandCandidates, never direct executions.
