export const CCT_SIGNAL_TYPES = {
  UI_INTENT: 'cct.ui.intent',
  GHOST_PROMOTE: 'cct.ghost.promote',
  GHOST_DISMISS: 'cct.ghost.dismiss',
  FOCUS_CHANGE: 'cct.focus.change',
  REVIEW_REQUEST: 'cct.review.request',
  SEARCH_QUERY: 'cct.search.query',
  MATTER_CREATE: 'cct.matter.create',
  CONTRACT_REVIEW: 'cct.contract.review',
  INVOICE_PROCESS: 'cct.invoice.process',
  OBLIGATION_TRACK: 'cct.obligation.track',
  DICTATION_START: 'cct.dictation.start',
  LISTENING_START: 'cct.listening.start',
} as const;

export type CctSignalType = (typeof CCT_SIGNAL_TYPES)[keyof typeof CCT_SIGNAL_TYPES];
