import fs from "node:fs";
import { google } from "googleapis";
import { buildCohort } from "@/lib/cohort-logic";
import type { Cohort } from "@/types/cohort";

export type AppendGoogleSheetResult =
  | { status: "skipped" }
  | { status: "ok" }
  | { status: "error"; error: string };

export type SignupRow = {
  cohortLabel: string;
  name: string;
  phone: string;
  lineId: string;
  email: string;
  notes?: string;
};

const MAX_CAPACITY = 20;
const DEFAULT_COHORT_LABELS = [
  "JUNE 8 – 9, 2026",
  "JUNE 15 – 16, 2026",
];

/** 本機開發可用檔案路徑；Vercel 等雲端請用 GOOGLE_SERVICE_ACCOUNT_JSON */
function getServiceAccountCredentials(): Record<string, unknown> {
  const inline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (inline) {
    try {
      return JSON.parse(inline) as Record<string, unknown>;
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON 不是合法 JSON");
    }
  }
  const filePath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim();
  if (filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<
      string,
      unknown
    >;
  }
  throw new Error(
    "缺少 Google 憑證：請設定 GOOGLE_SERVICE_ACCOUNT_JSON 或 GOOGLE_SERVICE_ACCOUNT_FILE",
  );
}

function hasGoogleSheetsEnv(): boolean {
  const hasCreds = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ||
      process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim(),
  );
  return Boolean(
    hasCreds &&
      process.env.GOOGLE_SHEET_SPREADSHEET_ID &&
      process.env.GOOGLE_SHEET_RANGE,
  );
}

function getSheetsClient() {
  const credentials = getServiceAccountCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function parseParticipantCount(noteCell?: string): number {
  const note = (noteCell ?? "").trim();
  if (!note) return 1;
  const match = note.match(/(\d+)\s*位?/);
  if (!match) return 1;
  const n = Number.parseInt(match[1], 10);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
}

function getSeedCohortLabels(): string[] {
  const fromEnv = (process.env.GOOGLE_COHORT_LABELS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_COHORT_LABELS;
}

export async function appendSignupToGoogleSheet(
  row: SignupRow,
): Promise<AppendGoogleSheetResult> {
  if (!hasGoogleSheetsEnv()) return { status: "skipped" };

  const spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID as string;
  const range = process.env.GOOGLE_SHEET_RANGE as string;

  try {
    const sheets = getSheetsClient();

    const nowIso = new Date().toISOString();
    const values = [
      nowIso,
      row.cohortLabel,
      row.name,
      row.phone,
      row.lineId,
      row.email,
      row.notes?.trim() ?? "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    return { status: "ok" };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Google Sheets append failed";
    return { status: "error", error: message };
  }
}

export type GetGoogleCohortsResult =
  | { status: "ok"; cohorts: Cohort[] }
  | { status: "skipped" }
  | { status: "error"; error: string };

export async function getCohortsFromGoogleSheet(): Promise<GetGoogleCohortsResult> {
  if (!hasGoogleSheetsEnv()) return { status: "skipped" };

  const spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID as string;
  const range = process.env.GOOGLE_SHEET_RANGE as string;

  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values ?? [];
    const totals = new Map<string, number>();
    const seedLabels = getSeedCohortLabels();
    for (const label of seedLabels) totals.set(label, 0);

    const seedSet = new Set(seedLabels);
    for (const row of rows) {
      const cohortLabel = (row[1] ?? "").toString().trim();
      if (!cohortLabel || /梯次/i.test(cohortLabel)) continue;
      if (!seedSet.has(cohortLabel)) continue;
      const participantCount = parseParticipantCount((row[6] ?? "").toString());
      totals.set(cohortLabel, (totals.get(cohortLabel) ?? 0) + participantCount);
    }

    const cohorts = [...totals.entries()].map(([label, registered]) =>
      buildCohort(`gs-${label}`, label, MAX_CAPACITY, registered),
    );

    return { status: "ok", cohorts };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Google Sheets fetch failed";
    return { status: "error", error: message };
  }
}

