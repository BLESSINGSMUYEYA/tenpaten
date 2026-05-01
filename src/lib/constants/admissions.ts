export const OVERRIDE_REASONS = [
    'Medical Circumstance',
    'Administrative Correction',
    'Faculty Request',
    'Appeals Outcome',
    'Data Entry Error',
    'Special Admission Criteria',
] as const;

export type OverrideReason = (typeof OVERRIDE_REASONS)[number];
