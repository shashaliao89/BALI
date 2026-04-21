import type { Cohort, CohortStatus } from "@/types/cohort";

export function computeStatus(remaining: number): CohortStatus {
  if (remaining <= 0) return "full";
  if (remaining <= 3) return "tight";
  return "available";
}

export function buildCohort(
  id: string,
  label: string,
  total: number,
  registered: number,
): Cohort {
  const safeTotal = Math.max(0, total);
  const safeRegistered = Math.min(Math.max(0, registered), safeTotal);
  const remaining = Math.max(0, safeTotal - safeRegistered);
  return {
    id,
    label,
    total: safeTotal,
    registered: safeRegistered,
    remaining,
    status: computeStatus(remaining),
  };
}
