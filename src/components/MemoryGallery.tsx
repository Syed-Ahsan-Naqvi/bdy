"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { memories } from "@/lib/content";

function Polaroid({
  src,
  title,
  caption,
  date,
  index,
}: (typeof memories)[number] & { index: number }) {
  const reduce = !!useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  const tilts = [-3, 2.5, -2, 3.5];

  return (
    <motion.article
      className="relative w-[min(78vw,280px)] shrink-0 snap-center sm:w-[min(70vw,320px)] md:w-[340px] lg:w-[380px]"
      style={
        reduce
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 800,
              rotate: tilts[index % tilts.length],
            }
      }
      onMouseMove={(e) => {
        if (reduce) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reduce ? undefined : { scale: 1.03, zIndex: 5 }}
    >
      <div className="rounded-sm bg-cream p-3 pb-10 shadow-[0_18px_50px_-20px_rgba(92,31,43,0.45)] ring-1 ring-burgundy/10">
        <div className="relative aspect-[4/5] overflow-hidden bg-vanilla">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 78vw, 380px"
            className="object-cover"
          />
        </div>
        <div className="mt-4 px-1">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            {date}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-burgundy">{title}</h3>
          <p className="mt-1 text-sm text-ink-soft">{caption}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function MemoryGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-72%"]);

  return (
    <section ref={ref} className="relative z-[2] h-[300vh] bg-transparent">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div className="mb-6 px-4 text-center md:mb-12 md:px-10">
          <p className="display-kicker mb-2 text-ink-soft">
            memory lane
          </p>
          <h2 className="display-title font-serif text-burgundy">
            Soft frames of us
          </h2>
        </div>

        <motion.div
          style={reduce ? undefined : { x }}
          className="flex w-max gap-5 px-4 md:gap-10 md:px-16"
        >
          {memories.map((m, i) => (
            <Polaroid key={m.title} {...m} index={i} />
          ))}
        </motion.div>

        <p className="mt-8 px-4 text-center text-sm text-ink-soft md:mt-10">
          Scroll to glide
          <span className="memory-hover-hint"> · hover to tilt</span>
        </p>
      </div>
    </section>
  );
}
