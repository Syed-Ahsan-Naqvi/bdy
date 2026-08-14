"use client";

import confetti from "canvas-confetti";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/lib/content";

const FIREWORK_COLORS = [
  "#c98b7b",
  "#c9a46a",
  "#5c1f2b",
  "#fbf6ef",
  "#e8b4a8",
  "#fff1d6",
  "#7a2e3c",
  "#f0a35a",
];

function fireLocketFinale() {
  const burst = (
    origin: { x: number; y: number },
    count: number,
    extra?: confetti.Options
  ) => {
    confetti({
      particleCount: count,
      spread: 360,
      startVelocity: 52,
      gravity: 0.78,
      ticks: 320,
      origin,
      colors: FIREWORK_COLORS,
      scalar: 1.2,
      zIndex: 90,
      disableForReducedMotion: true,
      ...extra,
    });
  };

  burst({ x: 0.5, y: 0.42 }, 180);
  burst({ x: 0.12, y: 0.22 }, 110);
  burst({ x: 0.88, y: 0.22 }, 110);
  burst({ x: 0.18, y: 0.68 }, 100);
  burst({ x: 0.82, y: 0.68 }, 100);
  burst({ x: 0.5, y: 0.12 }, 90, { startVelocity: 38 });

  const end = Date.now() + 2400;
  const interval = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(interval);
      return;
    }
    burst(
      { x: 0.08 + Math.random() * 0.84, y: 0.08 + Math.random() * 0.5 },
      75 + Math.floor(Math.random() * 40)
    );
  }, 220);

  return interval;
}

export default function LocketPromises() {
  const ref = useRef<HTMLDivElement>(null);
  const celebratedRef = useRef(false);
  const fireworkRef = useRef<number | null>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const lidRotate = useTransform(scrollYProgress, [0.12, 0.46], [0, -128]);
  const glow = useTransform(scrollYProgress, [0.28, 0.5], [0.15, 1]);
  const photoScale = useTransform(scrollYProgress, [0.3, 0.5], [0.86, 1]);
  const chainOpacity = useTransform(scrollYProgress, [0, 0.18], [0.4, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.42, 0.55], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.42, 0.55], [12, 0]);

  useEffect(() => {
    return () => {
      if (fireworkRef.current) window.clearInterval(fireworkRef.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;

    if (v >= 0.48 && !celebratedRef.current) {
      celebratedRef.current = true;
      fireworkRef.current = fireLocketFinale();
    }

    if (v < 0.32) {
      celebratedRef.current = false;
    }
  });

  return (
    <section ref={ref} className="relative z-[2] h-[240vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden section-stage">
        <p className="display-kicker mb-2 text-ink-soft">
          kept close
        </p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Meri pyaari & eklooti Babuu
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          Scroll — yeh khulta hai, ahista ahista.
        </p>

        <div className="relative mt-6 flex flex-col items-center md:mt-10">
          <motion.span
            style={{ opacity: reduce ? 1 : chainOpacity }}
            className="mb-1 h-8 w-px bg-gradient-to-b from-transparent to-gold md:h-10"
            aria-hidden
          />

          <div className="locket" style={{ perspective: 900 }}>
            <div className="locket__inner">
              <motion.div
                className="locket__photo"
                style={{
                  opacity: reduce ? 1 : glow,
                  scale: reduce ? 1 : photoScale,
                }}
              >
                <Image
                  src="/locket-portrait.jpg"
                  alt={site.name}
                  fill
                  sizes="180px"
                  className="object-cover object-[center_20%]"
                />
              </motion.div>

              <div className="locket__ring" aria-hidden />

              <motion.div
                className="locket__lid"
                style={reduce ? { rotateY: -128 } : { rotateY: lidRotate }}
              >
                <span className="locket__monogram">M ♥ B</span>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.p
          className="mt-6 max-w-lg px-2 text-center font-serif text-[clamp(1.15rem,3.2vw,1.9rem)] text-burgundy md:mt-10"
          style={
            reduce
              ? { opacity: 1, y: 0 }
              : { opacity: captionOpacity, y: captionY }
          }
        >
          Meri pyaari and eklooti Babuu
        </motion.p>
      </div>
    </section>
  );
}
