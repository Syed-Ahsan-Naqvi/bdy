"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
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
  const [mounted, setMounted] = useState(false);
  const reduceMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 0.55, 0.2]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => setMounted(true), []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <section ref={containerRef} className="relative h-[280vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#e8b4a833,transparent_55%),radial-gradient(ellipse_at_80%_90%,#c9a46a22,transparent_50%)]" />

        <motion.div
          style={{ opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[10%] z-10 px-6 text-center md:top-[8%]"
        >
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft">
            pieces of you
          </p>
          <h1 className="font-serif text-4xl font-medium text-burgundy md:text-6xl">
            {site.nickname}
          </h1>
          <p className="mt-2 font-serif text-lg text-ink-soft italic md:text-xl">
            Scroll — watch the pieces find home
          </p>
        </motion.div>

        <div className="relative z-[1] h-[min(68vh,600px)] w-full max-w-3xl px-4">
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
          className="absolute bottom-8 z-10 text-center text-sm text-ink-soft"
        >
          {site.name} · my favorite frame
        </motion.p>
      </div>
    </section>
  );
}
