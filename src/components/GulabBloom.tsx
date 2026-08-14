"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useState } from "react";

const PETALS = [
  { rotate: -52, delay: 0.05, x: -18, y: 8 },
  { rotate: -26, delay: 0.1, x: -10, y: -6 },
  { rotate: 0, delay: 0.02, x: 0, y: -12 },
  { rotate: 26, delay: 0.12, x: 10, y: -6 },
  { rotate: 52, delay: 0.08, x: 18, y: 8 },
  { rotate: -14, delay: 0.16, x: -6, y: 10 },
  { rotate: 14, delay: 0.18, x: 6, y: 10 },
];

function Petal({
  rotate,
  delay,
  x,
  y,
  open,
}: {
  rotate: number;
  delay: number;
  x: number;
  y: number;
  open: boolean;
}) {
  return (
    <motion.span
      className="gulab-petal"
      initial={false}
      animate={
        open
          ? { scale: 1, x, y, rotate, opacity: 1 }
          : { scale: 0.25, x: 0, y: 8, rotate: rotate * 0.2, opacity: 0.85 }
      }
      transition={{ duration: 0.85, delay: open ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export default function GulabBloom() {
  const [open, setOpen] = useState(false);

  function bloom() {
    if (open) return;
    setOpen(true);
    confetti({
      particleCount: 36,
      spread: 70,
      startVelocity: 18,
      gravity: 0.65,
      ticks: 220,
      origin: { y: 0.55 },
      colors: ["#c98b7b", "#e8b4a8", "#7a2e3c", "#fff1d6"],
      shapes: ["circle"],
      scalar: 0.9,
      zIndex: 90,
      disableForReducedMotion: true,
    });
  }

  return (
    <section className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-12 md:py-16">
      <p className="display-kicker mb-2 text-ink-soft">
        for Ap
      </p>
      <h2 className="display-title text-center font-serif text-burgundy">
        Ek gulab, Ap ke naam
      </h2>
      <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
        {open
          ? "Itni naram — jaise Ap ki care."
          : "Gulab pe tap karo, khil uthe."}
      </p>

      <button
        type="button"
        onClick={bloom}
        disabled={open}
        aria-label={open ? "Gulab khil chuka hai" : "Gulab khilao"}
        className="relative mt-8 flex h-44 w-44 items-center justify-center disabled:cursor-default sm:h-56 sm:w-56 md:mt-12 md:h-64 md:w-64"
      >
        <span className="gulab-stem" aria-hidden />
        <span className="gulab-leaf gulab-leaf--l" aria-hidden />
        <span className="gulab-leaf gulab-leaf--r" aria-hidden />

        <span className="relative z-10 grid h-36 w-36 place-items-center md:h-40 md:w-40">
          {PETALS.map((p) => (
            <Petal key={p.rotate} {...p} open={open} />
          ))}
          <motion.span
            className="gulab-center"
            animate={open ? { scale: 1 } : { scale: 0.7 }}
            transition={{ duration: 0.6 }}
          />
        </span>
      </button>

      <motion.p
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
        className="mt-3 max-w-md px-2 text-center font-serif text-[clamp(1.05rem,3vw,1.65rem)] text-burgundy"
      >
        Ap ke liye — hamesha khila hua.
      </motion.p>
    </section>
  );
}
