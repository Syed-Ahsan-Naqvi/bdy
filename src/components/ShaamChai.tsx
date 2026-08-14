"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";

const STEAM = [
  { x: -10, delay: 0 },
  { x: 0, delay: 0.18 },
  { x: 10, delay: 0.32 },
];

function Cup({ side }: { side: "left" | "right" }) {
  const left = side === "left";
  return (
    <div className={`chai-cup ${left ? "chai-cup--l" : "chai-cup--r"}`}>
      <span className="chai-handle" aria-hidden />
      <span className="chai-bowl">
        <span className="chai-tea" />
      </span>
      <span className="chai-saucer" aria-hidden />
    </div>
  );
}

export default function ShaamChai() {
  const [poured, setPoured] = useState(false);

  function clink() {
    if (poured) return;
    setPoured(true);
    confetti({
      particleCount: 24,
      spread: 46,
      startVelocity: 14,
      gravity: 0.8,
      origin: { y: 0.58 },
      colors: ["#c9a46a", "#c98b7b", "#fff1d6"],
      scalar: 0.65,
      zIndex: 90,
      disableForReducedMotion: true,
    });
  }

  return (
      <section
        className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-12 md:py-16"
      >
        <p className="display-kicker mb-2 text-ink-soft">shaam</p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Do pyaali chai
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          {poured
            ? "Ap ke saath wali chai sab se meethi."
            : "Pyaali pe tap karo — mil ke peete hain."}
        </p>

        <button
          type="button"
          onClick={clink}
          disabled={poured}
          aria-label={poured ? "Chai mil chuki hai" : "Chai ki pyaali milao"}
          className="relative mt-8 flex items-end justify-center disabled:cursor-default md:mt-12"
        >
          <motion.div
            initial={false}
            animate={{ x: poured ? 22 : 0, rotate: poured ? 8 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cup side="left" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ x: poured ? -22 : 0, rotate: poured ? -8 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Cup side="right" />
          </motion.div>

          <div className="pointer-events-none absolute top-[-0.4rem] left-1/2 flex -translate-x-1/2 gap-1">
            {STEAM.map((s) => (
              <motion.span
                key={s.x}
                className="chai-steam"
                initial={false}
                animate={
                  poured
                    ? { opacity: [0, 1, 0], y: [8, -28], scale: [0.7, 1] }
                    : { opacity: 0, y: 8 }
                }
                transition={{
                  duration: poured ? 2.1 : 0.2,
                  delay: poured ? 0.35 + s.delay : 0,
                  repeat: poured ? Infinity : 0,
                  ease: "easeOut",
                }}
                style={{ marginLeft: s.x }}
              >
                ♥
              </motion.span>
            ))}
          </div>
        </button>

        <motion.p
          initial={false}
          animate={{ opacity: poured ? 1 : 0, y: poured ? 0 : 10 }}
          className="mt-8 max-w-md px-2 text-center font-serif text-[clamp(1.05rem,3vw,1.65rem)] text-burgundy sm:mt-10"
        >
          Har shaam, yahi dua — Ap ke saath.
        </motion.p>
      </section>
  );
}
