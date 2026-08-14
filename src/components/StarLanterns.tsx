"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { lanterns, site } from "@/lib/content";

type Star = {
  x: number;
  y: number;
  r: number;
  tw: number;
  ph: number;
};

type Shoot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
};

type SkyLantern = {
  id: number;
  x: number;
  drift: number;
  duration: number;
  delay: number;
};

function Starfield({ reduce }: { reduce: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let shoots: Shoot[] = [];
    let raf = 0;
    let lastShoot = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(160, Math.floor((w * h) / 8000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.35,
        tw: 0.4 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShoot = (w: number, h: number) => {
      shoots.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h * (0.05 + Math.random() * 0.25),
        vx: 3.2 + Math.random() * 2.4,
        vy: 1.4 + Math.random() * 1.1,
        life: 0,
        max: 42 + Math.random() * 18,
      });
    };

    const draw = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const a = reduce
          ? 0.55
          : 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 236, 214, ${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce && now - lastShoot > 2800 + Math.random() * 2200) {
        spawnShoot(w, h);
        lastShoot = now;
      }

      shoots = shoots.filter((sh) => sh.life < sh.max);
      for (const sh of shoots) {
        sh.life += 1;
        sh.x += sh.vx;
        sh.y += sh.vy;
        const fade = 1 - sh.life / sh.max;
        ctx.strokeStyle = `rgba(233, 196, 150, ${0.85 * fade})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 7, sh.y - sh.vy * 7);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

function LanternGlow({ size = "md" }: { size?: "sm" | "md" }) {
  const wide = size === "md";
  return (
    <div className={`flex flex-col items-center ${wide ? "w-16" : "w-10"}`}>
      <span
        className={`w-px bg-gold/70 ${wide ? "h-5" : "h-3"}`}
        aria-hidden
      />
      <div
        className={`relative overflow-hidden rounded-[40%_40%_18%_18%] bg-gradient-to-b from-[#ffe7c4] via-[#e8b46a] to-[#c45a3a] shadow-[0_0_28px_rgba(240,163,90,0.7)] ring-1 ring-[#fff3d0]/50 ${
          wide ? "h-20 w-14" : "h-12 w-9"
        }`}
      >
        <span className="absolute inset-x-[22%] top-[18%] h-[28%] rounded-full bg-[#fff6d8]/90 blur-[1px]" />
        <span className="absolute inset-x-[30%] bottom-[16%] h-[18%] rounded-full bg-[#7a2e3c]/25" />
      </div>
      <div
        className={`rounded-b-md bg-[#5c1f2b] ${wide ? "h-1.5 w-10" : "h-1 w-7"}`}
      />
    </div>
  );
}

export default function StarLanterns() {
  const reduce = !!useReducedMotion();
  const [index, setIndex] = useState(0);
  const [sky, setSky] = useState<SkyLantern[]>([]);
  const [quote, setQuote] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [finale, setFinale] = useState(false);
  const idRef = useRef(0);

  const done = index >= lanterns.length;
  const left = lanterns.length - index;

  const burst = useCallback(
    (big = false) => {
      const colors = ["#c9a46a", "#e8b4a8", "#fff1d6", "#c98b7b", "#f0a35a"];
      confetti({
        particleCount: big ? 140 : 55,
        spread: big ? 90 : 65,
        startVelocity: big ? 48 : 32,
        origin: { y: big ? 0.62 : 0.72 },
        colors,
        ticks: 220,
      });
      if (big) {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });
      }
    },
    []
  );

  const sendLantern = useCallback(() => {
    if (index >= lanterns.length) return;

    const text = lanterns[index];
    const next = index + 1;
    const last = next >= lanterns.length;

    idRef.current += 1;
    setSky((prev) => [
      ...prev,
      {
        id: idRef.current,
        x: 18 + Math.random() * 56,
        drift: (Math.random() - 0.5) * 40,
        duration: reduce ? 0.2 : 7.5 + Math.random() * 2.5,
        delay: 0,
      },
    ]);
    setQuote(text);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 420);
    burst(last);
    setIndex(next);

    if (last) {
      window.setTimeout(() => {
        setFinale(true);
        if (!reduce) {
          const extras: SkyLantern[] = Array.from({ length: 6 }, (_, i) => ({
            id: 100 + i,
            x: 8 + i * 14,
            drift: (i % 2 === 0 ? -1 : 1) * (10 + i * 3),
            duration: 8,
            delay: i * 0.12,
          }));
          setSky((prev) => [...prev, ...extras]);
        }
      }, 380);
    }
  }, [burst, index, reduce]);

  return (
    <section
      id="lantern-sky"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[linear-gradient(180deg,#1f0c12_0%,#3a1520_48%,#4a2430_100%)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,#c98b7b44,transparent_55%),radial-gradient(ellipse_at_80%_8%,#c9a46a28,transparent_42%)]" />
      <Starfield reduce={reduce} />

      <AnimatePresence>
        {flash && (
          <motion.div
            key="blow-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_78%,#ffe7c4cc,transparent_58%)]"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-h-dvh flex-col section-stage pb-8 pt-10 md:pt-14">
        <header className="shrink-0 text-center">
          <p className="display-kicker mb-2 font-medium text-[#f3d5b0]">
            a sky for you
          </p>
          <h2 className="display-title font-serif text-cream">
            Send a lantern up
          </h2>
          <p className="display-sub mx-auto mt-2 max-w-md text-cream/85">
            Tap to blow it into the night — har lantern ek baat hai jo dil me
            thi.
          </p>
        </header>

        <div className="relative mx-auto mt-4 flex min-h-0 w-full max-w-2xl flex-1 flex-col items-center">
          <div className="relative z-20 flex min-h-[5.5rem] w-full items-center justify-center px-1 sm:min-h-[7.5rem]">
            <AnimatePresence mode="wait">
              {quote ? (
                <motion.blockquote
                  key={quote}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-lg rounded-sm bg-cream px-4 py-4 text-center shadow-[0_18px_50px_-18px_rgba(0,0,0,0.55)] ring-1 ring-gold/50 md:px-8 md:py-6"
                >
                  <p className="font-serif text-[clamp(1.05rem,3.4vw,1.65rem)] leading-snug text-burgundy">
                    {quote}
                  </p>
                </motion.blockquote>
              ) : (
                <motion.p
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-serif text-lg text-cream/75 md:text-xl"
                >
                  A wish is waiting in the lantern…
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {sky.map((item) => (
              <motion.div
                key={item.id}
                initial={{ y: "78%", opacity: 0, scale: 0.7 }}
                animate={{
                  y: reduce ? "10%" : ["78%", "-12%"],
                  x: reduce ? 0 : [0, item.drift],
                  opacity: [0, 1, 1, 0.85],
                  scale: 1,
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="lantern absolute bottom-0"
                style={{ left: `${item.x}%` }}
              >
                <LanternGlow size="sm" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-20 mt-4 flex shrink-0 flex-col items-center">
          {!done ? (
            <>
              <button
                type="button"
                onClick={sendLantern}
                className="group relative flex flex-col items-center"
                aria-label="Blow the lantern into the sky"
              >
                <span className="cta-pulse absolute top-[42%] h-28 w-28 rounded-full bg-gold/25" />
                <motion.span
                  animate={
                    reduce
                      ? undefined
                      : { scale: [1, 1.04, 1], y: [0, -3, 0] }
                  }
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="relative"
                >
                  <LanternGlow size="md" />
                </motion.span>
              </button>
              <button
                type="button"
                onClick={sendLantern}
                className="cta-btn relative mt-4 rounded-full bg-cream text-[0.95rem] font-medium tracking-wide text-burgundy shadow-[0_10px_32px_rgba(201,164,106,0.45)] ring-1 ring-gold/60 transition hover:bg-[#fff8ef] sm:mt-5"
              >
                Tap to blow
              </button>
              <p className="mt-2.5 text-sm text-cream/90">
                {left} lantern{left === 1 ? "" : "s"} waiting in your hands
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-2 text-center"
            >
              {finale && (
                <p className="font-serif text-2xl text-cream md:text-3xl">
                  Happy Birthday, {site.nicknameAlt}
                </p>
              )}
              <p className="mt-2 text-sm text-[#f3d5b0]">
                These stay in the sky. So do you.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
