import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { buildCohort } from "@/lib/cohort-logic";
import type { Cohort } from "@/types/cohort";

const TITLE_KEYS = ["Name", "梯次", "標題", "Title", "Label"];

const TOTAL_KEYS = ["Total", "總名額", "名額", "Capacity"];

const REGISTERED_KEYS = ["Registered", "已報名", "報名人數", "Booked"];

const SORT_KEYS = ["Start", "開始", "Date", "梯次日期"];

function findTitle(props: PageObjectResponse["properties"]): string {
  for (const key of TITLE_KEYS) {
    const p = props[key];
    if (p?.type === "title" && p.title.length) {
      return p.title.map((t) => t.plain_text).join("");
    }
  }
  for (const [, p] of Object.entries(props)) {
    if (p.type === "title" && p.title.length) {
      return p.title.map((t) => t.plain_text).join("");
    }
  }
  return "";
}

function findNumber(
  props: PageObjectResponse["properties"],
  keys: string[],
): number | null {
  for (const key of keys) {
    const p = props[key];
    if (p?.type === "number" && typeof p.number === "number") {
      return p.number;
    }
  }
  for (const [, p] of Object.entries(props)) {
    if (p.type === "number" && typeof p.number === "number") {
      return p.number;
    }
  }
  return null;
}

function findSortDate(
  props: PageObjectResponse["properties"],
): number | null {
  for (const key of SORT_KEYS) {
    const p = props[key];
    if (p?.type === "date" && p.date?.start) {
      return new Date(p.date.start).getTime();
    }
  }
  for (const [, p] of Object.entries(props)) {
    if (p.type === "date" && p.date?.start) {
      return new Date(p.date.start).getTime();
    }
  }
  return null;
}

export function pageToCohort(page: PageObjectResponse): Cohort | null {
  const label = findTitle(page.properties).trim();
  const total = findNumber(page.properties, TOTAL_KEYS);
  const registered = findNumber(page.properties, REGISTERED_KEYS);
  if (total === null || registered === null || !label) return null;
  return buildCohort(page.id, label, total, registered);
}

export function sortCohortPages(pages: PageObjectResponse[]): PageObjectResponse[] {
  return [...pages].sort((a, b) => {
    const da = findSortDate(a.properties);
    const db = findSortDate(b.properties);
    if (da !== null && db !== null) return da - db;
    if (da !== null) return -1;
    if (db !== null) return 1;
    return findTitle(a.properties).localeCompare(findTitle(b.properties));
  });
}

export const MOCK_COHORTS: Cohort[] = [
  buildCohort(
    "mock-june-8",
    "JUNE 8 – 11, 2026",
    24,
    9,
  ),
  buildCohort(
    "mock-june-15",
    "JUNE 15 – 17, 2026",
    20,
    16,
  ),
  buildCohort(
    "mock-july",
    "JULY 6 – 10, 2026",
    22,
    4,
  ),
];

