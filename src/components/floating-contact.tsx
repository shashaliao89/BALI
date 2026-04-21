"use client";

const IG = "https://www.instagram.com/stepc_carnival/";

export function FloatingContact() {
  return (
    <a
      href={IG}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex max-w-[min(calc(100vw-3rem),280px)] items-center gap-2 rounded-full border border-[#7b8f92]/35 bg-[#f7f9f9]/90 px-5 py-3.5 font-sans text-xs font-medium text-[#2f3a3c] shadow-[0_12px_40px_-8px_rgba(55,69,72,0.28)] backdrop-blur-md transition hover:border-[#657b7e]/50 hover:bg-[#fcfdfd] md:text-sm"
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#5f777a]"
        aria-hidden
      />
      與 STEPC 團隊聯絡
    </a>
  );
}
