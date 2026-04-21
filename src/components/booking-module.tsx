"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import type { Cohort } from "@/types/cohort";
import { FadeIn } from "@/components/motion-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json()) as Promise<{
    cohorts: Cohort[];
    source?: string;
  }>;

const MAX_CAPACITY = 25;
const MIN_GROUP_SIZE = 17;

type BookingStatus = "available" | "tight" | "full";

function StatusBadge({ status }: { status: BookingStatus }) {
  if (status === "full") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-[#c17b73]/35 bg-[#f8ecea] px-3 py-1 font-sans text-xs font-medium tracking-wide text-[#8a3f36]">
        <span aria-hidden>🔴</span> 已額滿
      </span>
    );
  }
  if (status === "tight") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-[#b9a07a]/35 bg-[#f7f1e8] px-3 py-1 font-sans text-xs font-medium tracking-wide text-[#6f5b3d]">
        <span aria-hidden>🟡</span> 席次緊張
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 border border-[#9faeaf]/35 bg-[#eef3f3] px-3 py-1 font-sans text-xs font-medium tracking-wide text-[#4f6466]">
      <span aria-hidden>🟢</span> 尚有名額
    </span>
  );
}

function cardAccentByStatus(status: BookingStatus) {
  if (status === "full") return "before:bg-[#9f4f45]/80";
  if (status === "tight") return "before:bg-[#8e7858]/80";
  return "before:bg-[#5e7477]/80";
}

function bookingMeta(cohort: Cohort) {
  const registered = Math.max(0, Math.min(MAX_CAPACITY, cohort.registered));
  const remaining = Math.max(0, MAX_CAPACITY - registered);
  const distanceToGroup = Math.max(0, MIN_GROUP_SIZE - registered);
  const status: BookingStatus =
    remaining <= 0 ? "full" : remaining <= 3 ? "tight" : "available";
  return { registered, remaining, distanceToGroup, status };
}

type FormState = {
  name: string;
  phone: string;
  lineId: string;
  email: string;
  notes: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  lineId: "",
  email: "",
  notes: "",
};

export function BookingModule() {
  const reduceMotion = useReducedMotion();
  const { data, error, isLoading } = useSWR("/api/cohorts", fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  const cohorts = data?.cohorts ?? [];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Cohort | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openFor = (c: Cohort) => {
    if (c.remaining <= 0) return;
    setSelected(c);
    setForm(emptyForm);
    setSuccess(false);
    setFormError(null);
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const participantCount = Math.max(1, Number.parseInt(form.notes || "1", 10) || 1);
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cohortId: selected.id,
          cohortLabel: selected.label,
          name: form.name,
          phone: form.phone,
          lineId: form.lineId,
          email: form.email,
          participantCount,
          notes: form.notes,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setFormError(json.error ?? "送出失敗，請稍後再試。");
        return;
      }
      setSuccess(true);
      void mutate("/api/cohorts");
    } catch {
      setFormError("網路錯誤，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="booking"
      initial={reduceMotion ? false : { opacity: 0, y: 42, scale: 0.985 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 border-y border-[#7b8c8f]/35 bg-[#f6f7f7] px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center font-sans text-xs uppercase tracking-[0.28em] text-[#4f585a]">
            Booking Collection
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl text-[#202729] md:text-4xl">
            預約你的梯次
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center font-sans text-[15px] leading-relaxed text-[#3f484a] md:text-base">
            選擇適合你的日期，STEPC團隊將與你確認訂單。
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-center font-sans text-sm text-[#5b6769] md:text-[15px]">
            更多梯次將陸續公布
          </p>
        </FadeIn>

        {error && (
          <p className="mt-8 text-center font-sans text-sm text-red-700">
            無法載入梯次資料，請重新整理頁面。
          </p>
        )}

        <div className="mt-14">
          {isLoading && (
            <p className="text-center font-sans text-sm text-[#6b6258]">
              載入梯次中…
            </p>
          )}
          <div
            className={cn(
              "flex gap-5 pb-3",
              "snap-x snap-mandatory overflow-x-auto",
              "scrollbar-thin [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {cohorts.map((c) => {
              const meta = bookingMeta(c);
              return (
                <article
                  key={c.id}
                  className={cn(
                    "group relative flex w-[min(100%,300px)] min-h-[430px] min-w-[255px] shrink-0 snap-center flex-col justify-between overflow-hidden border border-[#d7dede] bg-[#f1f4f4] px-7 py-8 shadow-[0_18px_55px_-24px_rgba(48,58,60,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-26px_rgba(48,58,60,0.3)] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:content-[''] md:min-h-[450px] md:min-w-[270px] lg:min-h-[470px] lg:min-w-[calc((100%-2.5rem)/3.2)]",
                    cardAccentByStatus(meta.status),
                  )}
                >
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.5)_24%,transparent_46%,rgba(168,184,186,0.12)_64%,transparent_86%)]"
                  aria-hidden
                />
                <div>
                  <p className="font-serif text-[1.35rem] leading-snug tracking-wide text-[#141a1c] md:text-2xl">
                    {c.label}
                  </p>
                  <div className="mt-6 space-y-3 font-sans text-sm text-[#222b2d]">
                    <p className="flex items-baseline justify-between gap-3 border-b border-[#708487]/14 pb-2">
                      <span className="text-[#374143]">目前報名人數</span>
                      <span className="font-serif text-[1.12rem] font-semibold tabular-nums text-[#111a1c] md:text-xl">
                        {meta.registered}
                        <span className="text-sm text-[#4d585b] md:text-base">
                          {" "}
                          位
                        </span>
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between gap-3 border-b border-[#708487]/14 pb-2">
                      <span className="text-[#374143]">距離成團</span>
                      <span className="font-serif text-[1.12rem] font-semibold tabular-nums text-[#111a1c] md:text-xl">
                        {meta.distanceToGroup}
                        <span className="text-sm text-[#4d585b] md:text-base">
                          {" "}
                          位
                        </span>
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between gap-3">
                      <span className="text-[#374143]">剩餘名額</span>
                      <span className="font-serif text-[1.2rem] font-semibold tabular-nums text-[#162124] md:text-[1.35rem]">
                        {meta.remaining}
                        <span className="text-sm text-[#4d585b] md:text-base">
                          {" "}
                          位
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="mt-6">
                    <StatusBadge status={meta.status} />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={meta.remaining <= 0}
                  onClick={() => openFor(c)}
                  className={cn(
                    "mt-10 w-full border py-3.5 font-sans text-base uppercase tracking-[0.2em] transition duration-300",
                    meta.remaining <= 0
                      ? "cursor-not-allowed border-[#c8cecf] bg-[#c8cecf] text-[#f3f5f5]"
                      : "border-[#5d7376] bg-[#5f777a] text-[#f5f8f8] shadow-[0_10px_24px_-14px_rgba(66,86,89,0.45)] hover:bg-[#547174]",
                  )}
                >
                  {meta.remaining <= 0 ? "已額滿" : "立即預訂"}
                </button>
              </article>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[#7d8f92]/18 bg-[#f7f9f9]/97 shadow-[0_30px_80px_-30px_rgba(50,61,63,0.32)]">
          {success ? (
            <>
              <DialogHeader>
                <DialogTitle>已收到你的回覆</DialogTitle>
                <DialogDescription className="!mt-4 text-base leading-relaxed text-[#4a433a]">
                  您的靈魂旅程準備開啟，STEPC團隊將盡快與您聯繫。
                </DialogDescription>
              </DialogHeader>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-4 w-full rounded-full bg-[#5f777a] py-3 font-sans text-sm text-[#f5f8f8] shadow-[0_10px_24px_-10px_rgba(66,86,89,0.52)] transition hover:bg-[#547174]"
              >
                關閉
              </button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>報名資料</DialogTitle>
                <DialogDescription className="!mt-2 leading-relaxed">
                  {selected?.label} — 請留下聯絡方式，我們將盡快與你確認。
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="mt-3 space-y-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#6b6258]">
                    姓名
                  </label>
                  <input
                    required
                    className="mt-1.5 w-full border border-[#8B4513]/15 bg-white/70 px-3 py-2.5 font-sans text-[#3d3428] outline-none transition focus:border-[#8f6b3f] focus:bg-white"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#6b6258]">
                    聯繫電話
                  </label>
                  <input
                    required
                    type="tel"
                    className="mt-1.5 w-full border border-[#8B4513]/15 bg-white/70 px-3 py-2.5 font-sans text-[#3d3428] outline-none transition focus:border-[#8f6b3f] focus:bg-white"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#6b6258]">
                    Line ID
                  </label>
                  <input
                    className="mt-1.5 w-full border border-[#8B4513]/15 bg-white/70 px-3 py-2.5 font-sans text-[#3d3428] outline-none transition focus:border-[#8f6b3f] focus:bg-white"
                    value={form.lineId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lineId: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#6b6258]">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="mt-1.5 w-full border border-[#8B4513]/15 bg-white/70 px-3 py-2.5 font-sans text-[#3d3428] outline-none transition focus:border-[#8f6b3f] focus:bg-white"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-[#6b6258]">
                    報名人數
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    className="mt-1.5 w-full border border-[#8B4513]/15 bg-white/70 px-3 py-2.5 font-sans text-[#3d3428] outline-none transition focus:border-[#8f6b3f] focus:bg-white"
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </div>
                {formError && (
                  <p className="font-sans text-sm text-red-700">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#5f777a] py-3.5 font-sans text-sm text-[#f5f8f8] shadow-[0_10px_24px_-10px_rgba(66,86,89,0.52)] transition hover:bg-[#547174] disabled:opacity-60"
                >
                  {submitting ? "送出中…" : "送出報名"}
                </button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
