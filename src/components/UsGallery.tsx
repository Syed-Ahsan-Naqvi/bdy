"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { usShots } from "@/lib/content";

export default function UsGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);

  function open(index: number) {
    setActive(index);
    setSeen(true);
  }

  return (
    <>
      <section
        className="relative z-[2] flex min-h-dvh flex-col items-center justify-center section-stage py-8 md:py-14"
      >
        <p className="display-kicker mb-2 text-ink-soft">just us</p>
        <h2 className="display-title text-center font-serif text-burgundy">
          Humari gallery
        </h2>
        <p className="display-sub mt-2 max-w-md text-center text-ink-soft">
          {seen
            ? "Yeh pal sirf hamare hain."
            : "Koi tasveer kholo — ahista ahista."}
        </p>

        <div className="us-grid mt-4 w-full max-w-md md:mt-6 md:max-w-lg">
          {usShots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => open(i)}
              aria-label={shot.alt}
              className="us-thumb"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 44vw, 240px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active !== null && (
          <motion.button
            type="button"
            key="us-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            aria-label="Gallery band karo"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(40,18,24,0.72)] px-4 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="us-lite"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={usShots[active].src}
                alt={usShots[active].alt}
                fill
                sizes="(max-width: 768px) 92vw, 520px"
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
