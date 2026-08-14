"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { letter, site } from "@/lib/content";

export default function WishSection() {
  const [lit, setLit] = useState(true);
  const [open, setOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [musicReady, setMusicReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const letterRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/bg.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const probe = () => setMusicReady(true);
    audio.addEventListener("canplaythrough", probe);
    audio.addEventListener("error", () => setMusicReady(false));
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", probe);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicReady) return;
    if (musicOn) {
      void audio.play().catch(() => setMusicOn(false));
    } else {
      audio.pause();
    }
  }, [musicOn, musicReady]);

  useEffect(() => {
    if (!open || !letterRef.current) return;
    window.setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 500);
  }, [open]);

  function blowCandle() {
    if (!lit) return;
    setLit(false);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#c98b7b", "#c9a46a", "#5c1f2b", "#f3e8d8", "#e8b4a8"],
    });
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.6 },
      colors: ["#c98b7b", "#c9a46a"],
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.6 },
      colors: ["#5c1f2b", "#e8b4a8"],
    });
    window.setTimeout(() => setOpen(true), 450);
  }

  return (
    <section
      className={`relative z-[2] flex flex-col bg-[linear-gradient(180deg,rgba(251,246,239,0.35)_0%,rgba(243,232,216,0.45)_50%,rgba(232,208,196,0.55)_100%)] ${
        open ? "min-h-dvh" : "h-dvh"
      }`}
    >
      {/* Full-screen stage: title + cake centered; footer pinned to bottom */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-24 pt-8 md:px-10 md:pt-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="display-kicker mb-2 text-ink-soft">
            make a wish
          </p>
          <h2 className="display-title font-serif text-burgundy">
            Happy Birthday, {site.nickname}
          </h2>
          <p className="display-sub mt-3 max-w-md text-ink-soft">
            Blow the candle — a letter opens for you.
          </p>

          <div className="relative mt-8 flex flex-col items-center md:mt-10">
            <button
              type="button"
              onClick={blowCandle}
              disabled={!lit}
              aria-label={lit ? "Blow out the candle" : "Candle is out"}
              className="group relative z-10 mb-[-0.35rem] flex flex-col items-center disabled:cursor-default"
            >
              <AnimatePresence>
                {lit && (
                  <motion.span
                    key="flame"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: [0.85, 1, 0.9],
                      scale: [1, 1.08, 0.96, 1],
                      rotate: [-2, 2, -1, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.2, y: -8 }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="mb-0.5 h-7 w-4 rounded-full bg-[radial-gradient(circle_at_50%_30%,#fff6c8,#f0a35a_45%,#c94b2a_80%)] shadow-[0_0_18px_#f0a35aaa]"
                  />
                )}
              </AnimatePresence>
              <span className="h-10 w-2 rounded-sm bg-gradient-to-b from-cream to-vanilla ring-1 ring-gold/30" />
            </button>

            <div className="relative mt-1 w-[200px] md:w-[240px]" aria-hidden>
              <div className="mx-auto h-4 w-[70%] rounded-full bg-rose-gold/50 blur-[1px]" />
              <div className="relative -mt-2 overflow-hidden rounded-[40%_40%_12px_12px] bg-gradient-to-b from-blush to-rose-gold shadow-[0_20px_40px_-18px_rgba(92,31,43,0.5)]">
                <div className="h-14 md:h-16" />
                <div className="absolute inset-x-0 top-3 flex justify-around px-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-gold/80" />
                  ))}
                </div>
              </div>
              <div className="relative -mt-1 overflow-hidden rounded-[10px] bg-gradient-to-b from-wine to-burgundy shadow-lg">
                <div className="h-12 md:h-14" />
                <div className="absolute inset-x-3 top-4 h-2 rounded-full bg-cream/25" />
                <div className="absolute inset-x-6 top-8 h-2 rounded-full bg-cream/15" />
              </div>
              <div className="mx-auto -mt-1 h-3 w-[92%] rounded-b-xl bg-burgundy/80" />
            </div>

            {lit && (
              <button
                type="button"
                onClick={blowCandle}
                className="cta-btn relative mt-6 rounded-full bg-burgundy text-[0.95rem] font-medium tracking-wide text-cream shadow-[0_10px_28px_rgba(92,31,43,0.28)] ring-1 ring-gold/50 transition hover:bg-wine md:mt-7"
              >
                <span className="cta-pulse-soft absolute inset-0 rounded-full" />
                Tap to blow
              </button>
            )}
          </div>

          {musicReady && (
            <button
              type="button"
              onClick={() => setMusicOn((v) => !v)}
              className="mt-8 rounded-full border border-burgundy/20 bg-cream/70 px-4 py-2 text-sm text-burgundy backdrop-blur-sm transition hover:border-gold/50"
            >
              {musicOn ? "Pause soft music" : "Play soft music"}
            </button>
          )}

          <AnimatePresence>
            {open && (
              <motion.article
                ref={letterRef}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 w-full max-w-xl rounded-sm bg-cream/95 p-5 text-left shadow-[0_30px_80px_-40px_rgba(92,31,43,0.55)] ring-1 ring-burgundy/10 md:mt-14 md:p-10"
              >
                <p className="font-serif text-2xl text-burgundy md:text-3xl">
                  {letter.greeting}
                </p>
                <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-ink">
                  {letter.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                <p className="mt-6 whitespace-pre-line font-serif text-xl italic text-wine">
                  {letter.closing}
                </p>
                <p className="mt-4 text-sm tracking-wide text-ink-soft">
                  {letter.signoff}
                </p>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer
        className={`z-10 bg-burgundy px-6 py-4 text-center text-cream/90 md:py-5 ${
          open
            ? "relative mt-8 shrink-0"
            : "pointer-events-none absolute inset-x-0 bottom-0 backdrop-blur-sm"
        }`}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <p className="font-serif text-lg text-cream md:text-xl">
          Forever soft for you, {site.nicknameAlt}
        </p>
      </footer>
    </section>
  );
}
