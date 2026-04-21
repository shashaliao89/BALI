import { NextResponse } from "next/server";
import { getCohortsFromGoogleSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const debug = process.env.GOOGLE_DEBUG === "1";
  const debugMeta = {
    hasServiceAccountJson: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()),
    hasServiceAccountFile: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_FILE?.trim()),
    hasSpreadsheetId: Boolean(process.env.GOOGLE_SHEET_SPREADSHEET_ID?.trim()),
    hasRange: Boolean(process.env.GOOGLE_SHEET_RANGE?.trim()),
  };

  const result = await getCohortsFromGoogleSheet();
  if (result.status === "ok") {
    return NextResponse.json({
      cohorts: result.cohorts,
      source: "google-sheets" as const,
      ...(debug ? { debug: debugMeta } : {}),
    });
  }

  if (result.status === "skipped") {
    return NextResponse.json(
      {
        cohorts: [],
        source: "google-sheets" as const,
        error: "Missing Google Sheets env config.",
        ...(debug ? { debug: debugMeta } : {}),
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      cohorts: [],
      source: "google-sheets" as const,
      error: result.error,
      ...(debug ? { debug: debugMeta } : {}),
    },
    { status: 500 },
  );
}
