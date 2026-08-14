"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";

const NOTES = [
  { char: "♪", x: "-4.6rem", y: "-2.2rem", delay: 0.35 },
  { char: "♫", x: "4.4rem", y: "-2.8rem", delay: 0.5 },
  { char: "♪", x: "-2.2rem", y: "-4.6rem", delay: 0.62 },
  { char: "♬", x: "2.4rem", y: "-5rem", delay: 0.74 },
];

export default function MusicBox() {
  const [open, setOpen] = useState(false);

  function play() {
    if (open) return;
    setOpen(true);
    window.setTimeout(() => {
      confetti({
        particleCount: 28,
        spread: 52,
        startVelocity: 16,
        gravity: 0.75,
        origin: { y: 0.58 },
        colors: ["#c9a46a", "#fff1d6", "#c98b7b"],
        scalar: 0.7,
        zIndex: 90,
        disableForReducedMotion: true,
      });
    }, 420);
  }

  return (
      <section
        className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-12 md:py-16"
      >
        <p className="display-kicker mb-2 text-ink-soft">a quiet song</p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Ap ki dhun
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          {open
            ? "Yeh wahi awaaz hai jo dil ko sukoon deti hai."
            : "Dibiya pe tap karo — dhun chalne lage."}
        </p>

        <button
          type="button"
          onClick={play}
          disabled={open}
          aria-label={open ? "Dhun chal rahi hai" : "Music box kholo"}
          className="relative mt-8 disabled:cursor-default md:mt-12"
        >
          <div className="sangeet" data-open={open ? "true" : "false"}>
            <motion.div
              className="sangeet__lid"
              initial={false}
              animate={{ rotateX: open ? -118 : 0 }}
              transition={{
                duration: 0.9,
                delay: open ? 0.12 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden
            >
              <span className="sangeet__hinge" />
              <span className="sangeet__inlay">M ♥ B</span>
            </motion.div>

            <div className="sangeet__well" aria-hidden>
              <motion.span
                className="sangeet__heart"
                initial={false}
                animate={
                  open
                    ? { rotate: 360, scale: 1, opacity: 1 }
                    : { rotate: 0, scale: 0.55, opacity: 0.35 }
                }
                transition={
                  open
                    ? {
                        rotate: { duration: 4.8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 0.45, delay: 0.35 },
                        opacity: { duration: 0.35, delay: 0.28 },
                      }
                    : { duration: 0.3 }
                }
              >
                ♥
              </motion.span>
            </div>

            <motion.span
              className="sangeet__crank"
              initial={false}
              animate={{ rotate: open ? 220 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            />
          </div>

          {NOTES.map((n) => (
            <motion.span
              key={n.char + n.x}
              className="sangeet-note"
              initial={false}
              animate={
                open
                  ? { opacity: [0, 1, 1, 0], y: [8, -18, -36], scale: [0.7, 1, 1] }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                duration: open ? 2.4 : 0.2,
                delay: open ? n.delay : 0,
                repeat: open ? Infinity : 0,
                ease: "easeOut",
              }}
              style={{ left: `calc(50% + ${n.x})`, top: n.y }}
            >
              {n.char}
            </motion.span>
          ))}
        </button>

        <motion.p
          initial={false}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
          className="mt-8 max-w-md px-2 text-center font-serif text-[clamp(1.05rem,3vw,1.65rem)] text-burgundy sm:mt-10"
        >
          Ap ki baatein meri favorite song hain.
        </motion.p>
      </section>
  );
}
