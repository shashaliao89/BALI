export type CohortStatus = "available" | "tight" | "full";

export type Cohort = {
  id: string;
  label: string;
  total: number;
  registered: number;
  remaining: number;
  status: CohortStatus;
};
