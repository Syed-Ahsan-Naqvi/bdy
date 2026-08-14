"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState } from "react";
import ThoughtStory from "@/components/ThoughtStory";
import RishtaDori from "@/components/RishtaDori";
import LittleNote from "@/components/LittleNote";
import MemoryGallery from "@/components/MemoryGallery";
import LocketPromises from "@/components/LocketPromises";
import GulabBloom from "@/components/GulabBloom";
import SoftPings from "@/components/SoftPings";
import PinkyPromise from "@/components/PinkyPromise";
import MusicBox from "@/components/MusicBox";
import ShaamChai from "@/components/ShaamChai";
import UsGallery from "@/components/UsGallery";
import StarLanterns from "@/components/StarLanterns";
import WishSection from "@/components/WishSection";
import FloatingHearts from "@/components/FloatingHearts";
import BackToTop from "@/components/BackToTop";
import { site } from "@/lib/content";
const HeroPuzzle = dynamic(() => import("@/components/HeroPuzzle"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-transparent">
      <p className="font-serif text-2xl text-burgundy">Gathering pieces…</p>
    </div>
  ),
});

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative z-[1] text-ink">
      {!opened && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#e8b4a866,transparent_55%),rgba(251,246,239,0.72)] section-stage backdrop-blur-[1px]">
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="group flex flex-col items-center gap-3 text-center"
            suppressHydrationWarning
          >
            <span className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft">
              for you
            </span>
            <span className="font-serif text-[clamp(2.4rem,8vw,4.5rem)] text-burgundy transition group-hover:scale-[1.03]">
              {site.nickname}
            </span>
            <span className="mt-2 text-sm text-ink-soft">
              tap to open your birthday scroll
            </span>
          </button>
        </div>
      )}

      {opened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FloatingHearts />
          <HeroPuzzle />
          <ThoughtStory />
          <RishtaDori />
          <LittleNote />
          <MemoryGallery />
          <LocketPromises />
          <GulabBloom />
          <SoftPings />
          <PinkyPromise />
          <MusicBox />
          <ShaamChai />
          <UsGallery />
          <StarLanterns />
          <WishSection />
          <BackToTop />
        </motion.div>
      )}
    </main>
  );
}
