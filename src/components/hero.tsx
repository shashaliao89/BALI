"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[64svh] overflow-hidden bg-[#1a1612]">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#2a2419] via-[#1f1c18] to-[#F5F5F0]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[64svh] flex-col items-center justify-center px-6 pb-8 pt-8 text-center md:px-12 md:pb-10 md:pt-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.45em] text-[#F5F5F0]/85"
        >
          STEPC presents
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.22] tracking-tight text-[#F5F5F0]"
        >
          STEPC Ｘ BALI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl font-sans text-sm uppercase tracking-[0.35em] text-[#F5F5F0]/80 md:text-base"
        >
          AWAKEN YOUR SOUL
        </motion.p>
      </div>
    </section>
  );
}
