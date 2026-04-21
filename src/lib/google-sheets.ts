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

function readRequiredEnv(keys: string[]): string | null {
  for (const k of keys) {
    const v = process.env[k];
    if (!v) return null;
  }
  return "ok";
}

function getSheetsClient() {
  const serviceAccountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE as string;
  const json = JSON.parse(fs.readFileSync(serviceAccountFile, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: json,
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
  const required = readRequiredEnv([
    "GOOGLE_SERVICE_ACCOUNT_FILE",
    "GOOGLE_SHEET_SPREADSHEET_ID",
    "GOOGLE_SHEET_RANGE",
  ]);
  if (!required) return { status: "skipped" };

  const serviceAccountFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE as string;
  const spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID as string;
  const range = process.env.GOOGLE_SHEET_RANGE as string;

  try {
    if (!serviceAccountFile) return { status: "skipped" };
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
  const required = readRequiredEnv([
    "GOOGLE_SERVICE_ACCOUNT_FILE",
    "GOOGLE_SHEET_SPREADSHEET_ID",
    "GOOGLE_SHEET_RANGE",
  ]);
  if (!required) return { status: "skipped" };

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

