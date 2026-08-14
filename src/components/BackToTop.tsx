"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 5.5l-6.2 6.2 1.4 1.4L11 9.3V19h2V9.3l3.8 3.8 1.4-1.4L12 5.5z"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
