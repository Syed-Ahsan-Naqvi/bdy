"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { pings } from "@/lib/content";

export default function SoftPings() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-12 md:py-16">
      <p className="display-kicker mb-2 text-ink-soft">a quiet ping</p>
      <h2 className="display-title max-w-xl text-center font-serif text-burgundy">
        Ap ki smile, meri favorite notification
      </h2>
      <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
        {open ? "Yeh chhoti si baatein dil ke paas rehti hain." : "Notification pe tap karo."}
      </p>

      <div className="mt-8 w-full max-w-sm md:mt-10 md:max-w-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={open}
          className="w-full text-left disabled:cursor-default"
          aria-label="Notification kholo"
        >
          <motion.div
            layout
            className="ping-card"
            whileTap={open ? undefined : { scale: 0.98 }}
          >
            <span className="ping-dot" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-lg text-burgundy">Manuu</p>
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
                  now
                </p>
              </div>
              <p className="mt-1 truncate text-sm text-ink">
                Ap ki smile aa gai…
              </p>
            </div>
          </motion.div>
        </button>

        <div className="mt-5 flex min-h-[11rem] flex-col gap-2.5">
          <AnimatePresence>
            {open &&
              pings.map((msg, i) => (
                <motion.div
                  key={msg.text}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.12 + i * 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="ping-bubble"
                >
                  <p className="text-[0.7rem] text-gold">{msg.from}</p>
                  <p className="mt-1 font-serif text-[1.05rem] leading-snug text-burgundy">
                    {msg.text}
                  </p>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
