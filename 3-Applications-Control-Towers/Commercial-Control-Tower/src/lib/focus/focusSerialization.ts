/**
 * Focus State Serialization — Replay-Safe
 * Focus state must be deterministic and serializable.
 */

import { FocusSnapshot } from './focusTypes';

export function serializeFocusSnapshot(snapshot: FocusSnapshot): string {
  return JSON.stringify(snapshot);
}

export function deserializeFocusSnapshot(data: string): FocusSnapshot {
  return JSON.parse(data);
}
