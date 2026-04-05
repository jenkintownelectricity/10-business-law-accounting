# Voice Assist Layer

Non-sovereign assist layer for voice-based intake within the Business Law Accounting Domain OS.

Reference: Hive215/premier_voice_assistant

## Role
Advisory input layer — captures spoken commands, meeting notes, and dictation.
All output is advisory and must be routed through the Commercial Orchestrator for review.

## Components
- **voiceAssistLayer.ts** — Main entry point, voice session handling
- **voiceSessionManager.ts** — Start, pause, resume, stop sessions
- **spokenCommandHandler.ts** — Parse spoken commands into candidates (never execute directly)
- **ironEarListener.ts** — Iron Ear listening mode, advisory output only
- **types.ts** — Voice session and transcript types

## Trust Level
NON-SOVEREIGN — This layer produces advisory output only.
It cannot modify domain truth or execute commands directly.

## Constraints
- Voice output is always advisory, never authoritative
- Spoken commands produce candidates, not executions
- All intake must flow through orchestrator review queues
