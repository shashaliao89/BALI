import { NextResponse } from "next/server";
import { appendSignupToGoogleSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

type Body = {
  cohortId?: string;
  cohortLabel: string;
  name: string;
  phone: string;
  lineId: string;
  email: string;
  participantCount?: number;
  notes?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { cohortLabel, name, phone, lineId, email, notes, participantCount } = body;
  const count = Math.max(
    1,
    Math.min(25, Number.isFinite(participantCount) ? Math.floor(participantCount as number) : 1),
  );
  if (
    !cohortLabel?.trim() ||
    !name?.trim() ||
    !phone?.trim() ||
    !email?.trim()
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  // 送出後先寫入 Google Sheets（若已在後台完成設定）。
  // 設定缺失時會回傳 skipped，不會阻止 Notion 寫入或前端流程。
  const googleResult = await appendSignupToGoogleSheet({
    cohortLabel: cohortLabel.trim(),
    name: name.trim(),
    phone: phone.trim(),
    lineId,
    email: email.trim(),
    notes: notes?.trim() ? `${notes.trim()}（報名人數：${count} 位）` : `報名人數：${count} 位`,
  });

  if (googleResult.status === "error") {
    return NextResponse.json(
      { ok: false, error: `Google Sheets write failed: ${googleResult.error}` },
      { status: 500 },
    );
  }
  if (googleResult.status === "skipped") {
    return NextResponse.json(
      { ok: false, error: "Google Sheets env 尚未設定完整。" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, googleSheet: googleResult.status });
}
