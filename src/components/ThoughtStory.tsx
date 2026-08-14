"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { thoughts, site } from "@/lib/content";

function ThoughtLine({
  line,
  index,
  progress,
  reduce,
}: {
  line: string;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const start = 0.1 + index * 0.09;
  const mid = start + 0.05;
  const end = start + 0.12;
  const opacity = useTransform(
    progress,
    [start, mid, end, Math.min(0.95, end + 0.08)],
    [0, 1, 1, 0.35]
  );
  const y = useTransform(progress, [start, mid], [18, 0]);

  return (
    <motion.p
      className="font-serif thought-line text-[0.9rem] leading-snug text-ink sm:text-lg md:text-xl lg:text-2xl"
      style={
        reduce
          ? { opacity: 1, y: 0 }
          : { opacity, y, color: "var(--ink)" }
      }
    >
      {line}
    </motion.p>
  );
}

export default function ThoughtStory() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduce = useReducedMotion();
  const reduce = prefersReduce === true;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);
  const bubbleOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const glow = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 1]);
  const frameGlow = useTransform(
    scrollYProgress,
    [0.12, 0.4],
    ["0 0 0 rgba(201,164,106,0)", "0 0 40px rgba(201,164,106,0.35)"]
  );

  return (
    <section ref={ref} className="relative z-[2] h-[320vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div className="thought-layout">
          {/* Back view: you looking at a large wall portrait */}
          <motion.div
            style={{ boxShadow: reduce ? undefined : frameGlow }}
            className="thought-visual ring-1 ring-burgundy/10"
          >
            <Image
              src="/thought-guy-v9.jpg"
              alt="Looking at your portrait on the wall"
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 560px"
              className="object-cover object-center"
              priority
            />

            {/* Soft vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,transparent_30%,rgba(92,31,43,0.06)_100%)]" />

            {/* Thought path from you toward the large portrait */}
            <svg
              viewBox="0 0 600 400"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="pathGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c9a46a" />
                  <stop offset="100%" stopColor="#c98b7b" />
                </linearGradient>
              </defs>
              <motion.path
                d="M210 210 C280 150, 360 110, 430 125"
                fill="none"
                stroke="url(#pathGlow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  pathLength: reduce ? 1 : pathLength,
                  opacity: reduce ? 1 : glow,
                }}
              />
              <motion.circle
                cx="430"
                cy="125"
                r="5"
                fill="#c9a46a"
                style={{ opacity: reduce ? 1 : bubbleOpacity }}
              />
            </svg>

            <motion.div
              style={{ opacity: reduce ? 1 : bubbleOpacity }}
              className="pointer-events-none absolute right-[8%] top-[6%] rounded-full border border-gold/40 bg-cream/85 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-wine backdrop-blur-sm md:px-3 md:text-[0.65rem]"
            >
              in my thoughts
            </motion.div>
          </motion.div>

          <div className="thought-copy">
            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-ink-soft md:mb-3 md:text-[0.7rem]">
              looking at you
            </p>
            <h2 className="display-title mb-3 font-serif text-burgundy md:mb-6">
              In my thoughts, {site.nickname}
            </h2>

            <div className="relative space-y-1.5 sm:space-y-3 md:space-y-5">
              {thoughts.map((line, i) => (
                <ThoughtLine
                  key={line}
                  line={line}
                  index={i}
                  progress={scrollYProgress}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
