"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LittleNote() {
  const [open, setOpen] = useState(false);

  function openNote() {
    if (open) return;
    setOpen(true);
    window.setTimeout(() => {
      confetti({
        particleCount: 42,
        spread: 55,
        startVelocity: 20,
        gravity: 0.9,
        origin: { y: 0.62 },
        colors: ["#c98b7b", "#c9a46a", "#e8b4a8", "#fff1d6"],
        scalar: 0.75,
        zIndex: 90,
        disableForReducedMotion: true,
      });
    }, 550);
  }

  return (
    <section className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-12 md:py-16">
      <p className="display-kicker mb-2 text-ink-soft">
        secretly
      </p>
      <h2 className="display-title text-center font-serif text-burgundy">
        Ek chhoti si chitthi
      </h2>
      <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
        {open ? "Sirf Ap ke liye." : "Seal pe tap karo — note khulta hai."}
      </p>

      <button
        type="button"
        onClick={openNote}
        disabled={open}
        aria-label={open ? "Chitthi khul chuki hai" : "Chitthi kholo"}
        className={`relative w-[min(92vw,380px)] disabled:cursor-default lg:w-[420px] ${
          open ? "mt-16 md:mt-20" : "mt-8 md:mt-12"
        }`}
      >
        <div className="chitthi" data-open={open ? "true" : "false"}>
          <motion.article
            className="chitthi__letter"
            initial={false}
            animate={
              open
                ? { y: "-18%", opacity: 1 }
                : { y: "28%", opacity: 0 }
            }
            transition={{
              duration: 0.8,
              delay: open ? 0.5 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="font-serif text-lg text-burgundy md:text-xl">
              Cutiee Piee,
            </p>
            <p className="mt-3 font-serif text-[1.02rem] leading-relaxed text-ink md:mt-4 md:text-lg">
              Sirf itna kehna tha — Ap meri favorite person ho. Dil ko ab
              chhoti chhoti baaton mein bhi Ap yaad aa jati ho.
            </p>
            <p className="mt-5 text-sm tracking-wide text-ink-soft">
              — Manuu ka chhota sa note
            </p>
          </motion.article>

          <div className="chitthi__pocket" aria-hidden />

          <motion.div
            className="chitthi__flap"
            initial={false}
            animate={{ rotateX: open ? 168 : 0 }}
            transition={{
              duration: 0.9,
              delay: open ? 0.18 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          />

          <motion.span
            className="chitthi__seal"
            initial={false}
            animate={{
              opacity: open ? 0 : 1,
              scale: open ? 0.55 : 1,
            }}
            transition={{ duration: 0.28 }}
            aria-hidden
          >
            M
          </motion.span>
        </div>
      </button>
    </section>
  );
}
