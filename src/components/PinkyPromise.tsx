"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function PinkyPromise() {
  const [locked, setLocked] = useState(false);

  function lock() {
    if (locked) return;
    setLocked(true);
    confetti({
      particleCount: 36,
      spread: 58,
      startVelocity: 18,
      gravity: 0.8,
      origin: { y: 0.58 },
      colors: ["#c98b7b", "#c9a46a", "#fff1d6"],
      scalar: 0.75,
      zIndex: 90,
      disableForReducedMotion: true,
    });
  }

  return (
      <section
        className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-10 md:py-16"
      >
        <p className="display-kicker mb-2 text-ink-soft">a promise</p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Haath mein haath
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          {locked
            ? "Ab yeh haath nahi chhootain."
            : "Tap karo — haath mil jayein."}
        </p>

        <button
          type="button"
          onClick={lock}
          disabled={locked}
          aria-label={
            locked ? "Haath mil chuke hain" : "Haath milane ke liye tap karo"
          }
          className="pinky-scene relative mt-5 w-full max-w-3xl disabled:cursor-default md:mt-8"
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: locked ? 0 : 1,
              scale: locked ? 1.08 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/pinky-apart.jpg"
              alt="Manuu aur Babuu — haath barhate hue"
              fill
              sizes="(max-width: 768px) 94vw, 768px"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: locked ? 1 : 0,
              scale: locked ? 1 : 0.94,
            }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/pinky-hold.jpg"
              alt="Manuu aur Babuu — haath mein haath"
              fill
              sizes="(max-width: 768px) 94vw, 768px"
              className="object-cover object-center"
              priority
            />
          </motion.div>

          <motion.span
            className="pointer-events-none absolute top-[42%] left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-b from-[#fff1d6] to-[#c9a46a] text-burgundy shadow-[0_0_18px_rgba(201,164,106,0.45)] sm:h-10 sm:w-10"
            initial={false}
            animate={{
              opacity: locked ? 1 : 0,
              scale: locked ? 1 : 0.55,
            }}
            transition={{ delay: locked ? 0.35 : 0, duration: 0.35 }}
          >
            ♥
          </motion.span>
        </button>

        <motion.p
          initial={false}
          animate={{ opacity: locked ? 1 : 0, y: locked ? 0 : 10 }}
          className="mt-4 max-w-md px-2 text-center font-serif text-[clamp(1.05rem,3vw,1.65rem)] text-burgundy sm:mt-6"
        >
          Main yahan hoon. Hamesha — Ap ke liye.
        </motion.p>
      </section>
  );
}
