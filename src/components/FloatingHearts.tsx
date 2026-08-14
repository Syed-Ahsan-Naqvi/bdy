"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type HeartKind = "manuu" | "babuu" | "both" | "plain";

const HEARTS: {
  x: number;
  y: number;
  size: number;
  kind: HeartKind;
  delay: number;
  rotate: number;
}[] = [
  { x: 2, y: 8, size: 78, kind: "manuu", delay: 0, rotate: -12 },
  { x: 88, y: 4, size: 86, kind: "babuu", delay: 0.4, rotate: 10 },
  { x: 10, y: 72, size: 96, kind: "both", delay: 0.2, rotate: -6 },
  { x: 78, y: 78, size: 74, kind: "manuu", delay: 0.8, rotate: 8 },
  { x: -2, y: 40, size: 64, kind: "plain", delay: 0.3, rotate: -18 },
  { x: 92, y: 36, size: 70, kind: "plain", delay: 1.1, rotate: 14 },
  { x: 18, y: 2, size: 58, kind: "babuu", delay: 0.5, rotate: -8 },
  { x: 70, y: 88, size: 82, kind: "both", delay: 0.1, rotate: 6 },
  { x: 4, y: 88, size: 60, kind: "plain", delay: 0.9, rotate: 16 },
  { x: 84, y: 58, size: 72, kind: "manuu", delay: 0.6, rotate: -10 },
  { x: 42, y: -4, size: 66, kind: "plain", delay: 1.3, rotate: 4 },
  { x: 58, y: 92, size: 90, kind: "babuu", delay: 0.2, rotate: -14 },
  { x: -4, y: 18, size: 54, kind: "plain", delay: 0.7, rotate: 20 },
  { x: 96, y: 18, size: 62, kind: "both", delay: 1, rotate: -16 },
  { x: 8, y: 54, size: 80, kind: "manuu", delay: 0.4, rotate: 7 },
  { x: 74, y: 12, size: 56, kind: "plain", delay: 1.4, rotate: -5 },
  { x: 28, y: 86, size: 68, kind: "babuu", delay: 0.3, rotate: 11 },
  { x: 50, y: 6, size: 52, kind: "plain", delay: 0.8, rotate: -20 },
  { x: 90, y: 88, size: 88, kind: "both", delay: 0.5, rotate: 9 },
  { x: 0, y: 62, size: 50, kind: "plain", delay: 1.2, rotate: -11 },
  { x: 64, y: -6, size: 76, kind: "manuu", delay: 0.15, rotate: 13 },
  { x: 86, y: 44, size: 58, kind: "plain", delay: 0.9, rotate: -7 },
  { x: 16, y: 30, size: 48, kind: "plain", delay: 1.6, rotate: 18 },
  { x: 38, y: 94, size: 64, kind: "babuu", delay: 0.25, rotate: -9 },
  { x: 94, y: 70, size: 84, kind: "both", delay: 0.7, rotate: 5 },
  { x: 6, y: 0, size: 46, kind: "plain", delay: 1.1, rotate: -15 },
];

function HeartLabel({ kind }: { kind: HeartKind }) {
  if (kind === "plain") return null;
  if (kind === "manuu") return <span className="thought-heart__label">Manuu</span>;
  if (kind === "babuu") return <span className="thought-heart__label">Babuu</span>;
  return (
    <span className="thought-heart__label" style={{ fontSize: "0.72em" }}>
      <span>Manuu</span>
      <span aria-hidden>♥</span>
      <span>Babuu</span>
    </span>
  );
}

function Heart({
  x,
  y,
  size,
  kind,
  delay,
  rotate,
}: (typeof HEARTS)[number]) {
  const fontSize = kind === "both" ? size * 0.16 : size * 0.2;

  return (
    <div
      className="thought-heart"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size * 0.92,
        fontSize,
        rotate: `${rotate}deg`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fill={kind === "plain" ? "#e8b4a8" : "#c98b7b"}
          fillOpacity={kind === "plain" ? 0.55 : 0.82}
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <HeartLabel kind={kind} />
    </div>
  );
}

export default function FloatingHearts() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    let heroOn = true;
    let lanternOn = false;

    const apply = () => {
      if (!cancelled) setVisible(!heroOn && !lanternOn);
    };

    const bind = () => {
      const hero = document.getElementById("hero-puzzle");
      const lantern = document.getElementById("lantern-sky");
      if (!hero || !lantern) {
        if (!cancelled) requestAnimationFrame(bind);
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const on = entry.intersectionRatio > 0.28;
            if (entry.target.id === "hero-puzzle") heroOn = on;
            if (entry.target.id === "lantern-sky") lanternOn = on;
          }
          apply();
        },
        { threshold: [0, 0.15, 0.28, 0.45, 0.65] }
      );

      io.observe(hero);
      io.observe(lantern);
    };

    bind();
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, []);

  return (
    <motion.div
      className="thought-hearts thought-hearts--fixed"
      aria-hidden
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45 }}
      style={{ pointerEvents: "none" }}
    >
      {HEARTS.map((heart, i) => (
        <Heart key={`${heart.kind}-${i}`} {...heart} />
      ))}
    </motion.div>
  );
}
