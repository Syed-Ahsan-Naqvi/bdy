"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export default function RishtaDori() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const [knotOn, setKnotOn] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0.12, 0.58], [0, 1]);
  const line = useTransform(scrollYProgress, [0.55, 0.72, 1], [0, 1, 1]);
  const lineY = useTransform(scrollYProgress, [0.55, 0.72], [16, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.48) setKnotOn(true);
    if (v < 0.16) setKnotOn(false);
  });

  return (
    <section ref={ref} className="relative z-[2] h-[200vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center overflow-hidden section-stage">
        <p className="display-kicker mb-2 text-ink-soft">yeh rishta</p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Manuu se Babuu tak
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          Scroll — dori banti hai, ahista ahista.
        </p>

        <div className="dori-row mt-8 w-full max-w-lg md:mt-12 md:max-w-xl">
          <p className="dori-name font-serif text-burgundy">Manuu</p>

          <div className="dori-heart">
            <svg viewBox="0 0 24 24" className="dori-heart__svg" aria-hidden>
              <motion.path
                d={HEART_PATH}
                fill="none"
                stroke="#c9a46a"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  pathLength: reduce ? 1 : pathLength,
                }}
              />
            </svg>
            <motion.span
              className="dori-heart__fill"
              initial={false}
              animate={{
                opacity: reduce || knotOn ? 1 : 0,
                scale: reduce || knotOn ? 1 : 0.7,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path fill="#5c1f2b" d={HEART_PATH} />
              </svg>
            </motion.span>
          </div>

          <p className="dori-name font-serif text-burgundy">Babuu</p>
        </div>

        <motion.p
          className="mt-8 max-w-xl px-2 text-center font-serif text-[clamp(1.05rem,2.8vw,1.65rem)] leading-snug text-burgundy md:mt-14"
          style={reduce ? { opacity: 1, y: 0 } : { opacity: line, y: lineY }}
        >
          Itne kam time mein itni jaldi, itna close ho gaya — ab Ap ki adat ho
          gai hai.
        </motion.p>
      </div>
    </section>
  );
}
