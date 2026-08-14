"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import confetti from "canvas-confetti";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
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

function fireAssembleFinale() {
  const burst = (origin: { x: number; y: number }, count: number, extra?: confetti.Options) => {
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

const COLS = 5;
const ROWS = 6;
const GAP = 0.02;

type ProgressRef = { current: number };

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function PuzzlePiece({
  col,
  row,
  texture,
  progressRef,
  reduceMotion,
}: {
  col: number;
  row: number;
  texture: THREE.Texture;
  progressRef: ProgressRef;
  reduceMotion: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const pieceW = 1 / COLS;
  const pieceH = 1 / ROWS;

  const end = useMemo(
    () =>
      new THREE.Vector3(
        (col + 0.5) * pieceW - 0.5,
        0.5 - (row + 0.5) * pieceH,
        0
      ),
    [col, row, pieceW, pieceH]
  );

  const start = useMemo(() => {
    const seed = col * 17 + row * 31;
    const rand = (n: number) => {
      const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return new THREE.Vector3(
      (rand(1) - 0.5) * 2.6,
      (rand(2) - 0.5) * 2.2,
      0.35 + rand(3) * 1.4
    );
  }, [col, row]);

  const startRot = useMemo(() => {
    const seed = col * 9 + row * 13;
    const r = (n: number) => Math.sin(seed * 4.1 + n) * Math.PI;
    return new THREE.Euler(r(1) * 0.55, r(2) * 0.75, r(3) * 0.45);
  }, [col, row]);

  const map = useMemo(() => {
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.offset.set(col / COLS, 1 - (row + 1) / ROWS);
    t.repeat.set(1 / COLS, 1 / ROWS);
    t.needsUpdate = true;
    return t;
  }, [texture, col, row]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const t = reduceMotion ? 1 : easeInOutCubic(progressRef.current);
    m.position.lerpVectors(start, end, t);
    m.rotation.x = THREE.MathUtils.lerp(startRot.x, 0, t);
    m.rotation.y = THREE.MathUtils.lerp(startRot.y, 0, t);
    m.rotation.z = THREE.MathUtils.lerp(startRot.z, 0, t);
  });

  return (
    <mesh ref={mesh} position={start.toArray()} rotation={startRot}>
      <planeGeometry args={[pieceW - GAP * 0.4, pieceH - GAP * 0.4]} />
      <meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function PuzzleScene({
  progressRef,
  reduceMotion,
}: {
  progressRef: ProgressRef;
  reduceMotion: boolean;
}) {
  const texture = useTexture("/portrait-v2.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const pieces = useMemo(() => {
    const list: { col: number; row: number; key: string }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        list.push({ col, row, key: `${col}-${row}` });
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, 0.02, 0]} scale={[2.2, 2.75, 1]}>
      {pieces.map((p) => (
        <PuzzlePiece
          key={p.key}
          col={p.col}
          row={p.row}
          texture={texture}
          progressRef={progressRef}
          reduceMotion={reduceMotion}
        />
      ))}
    </group>
  );
}

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-vanilla/40">
      <div
        className="h-[70%] w-[55%] max-w-sm animate-pulse rounded-sm bg-gradient-to-br from-blush/80 via-rose-gold/50 to-vanilla shadow-lg"
        aria-hidden
      />
    </div>
  );
}

export default function HeroPuzzle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const celebratedRef = useRef(false);
  const fireworkRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 0.55, 0.2]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (fireworkRef.current) window.clearInterval(fireworkRef.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    if (reduceMotion) return;

    if (v >= 0.9 && !celebratedRef.current) {
      celebratedRef.current = true;
      fireworkRef.current = fireAssembleFinale();
    }

    if (v < 0.72) {
      celebratedRef.current = false;
    }
  });

  return (
    <section ref={containerRef} id="hero-puzzle" className="relative h-[280vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center overflow-hidden section-stage">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#e8b4a833,transparent_55%),radial-gradient(ellipse_at_80%_90%,#c9a46a22,transparent_50%)]" />

        <motion.div
          style={{ opacity: titleOpacity }}
          className="relative z-20 w-full shrink-0 px-2 text-center"
        >
          <p className="display-kicker mb-2 text-ink-soft">
            pieces of you
          </p>
          <h1 className="display-title font-serif font-medium text-burgundy">
            {site.nickname}
          </h1>
          <p className="display-sub mt-2 font-serif italic text-ink-soft">
            Scroll — watch the pieces find home
          </p>
        </motion.div>

        <div className="relative z-[1] mt-2 min-h-0 w-full max-w-3xl flex-1 overflow-hidden lg:max-w-4xl xl:max-w-5xl">
          {mounted ? (
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 3.4], fov: 42 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              className="!h-full !w-full"
            >
              <ambientLight intensity={1.2} />
              <Suspense fallback={null}>
                <PuzzleScene
                  progressRef={progressRef}
                  reduceMotion={reduceMotion}
                />
              </Suspense>
            </Canvas>
          ) : (
            <CanvasFallback />
          )}
        </div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="relative z-20 mt-2 shrink-0 text-center text-sm text-ink-soft"
        >
          {site.name} · my favorite frame
        </motion.p>
      </div>
    </section>
  );
}
