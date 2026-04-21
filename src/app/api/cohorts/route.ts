import { NextResponse } from "next/server";
import { getCohortsFromGoogleSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getCohortsFromGoogleSheet();
  if (result.status === "ok") {
    return NextResponse.json({
      cohorts: result.cohorts,
      source: "google-sheets" as const,
    });
  }

  if (result.status === "skipped") {
    return NextResponse.json(
      {
        cohorts: [],
        source: "google-sheets" as const,
        error: "Missing Google Sheets env config.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      cohorts: [],
      source: "google-sheets" as const,
      error: result.error,
    },
    { status: 500 },
  );
}
