"use client";

export default function AmbientGlow() {
  return (
    <div className="ambient-glow" aria-hidden>
      <span className="ambient-glow__orb ambient-glow__orb--a" />
      <span className="ambient-glow__orb ambient-glow__orb--b" />
      <span className="ambient-glow__orb ambient-glow__orb--c" />
      <span className="ambient-glow__orb ambient-glow__orb--d" />
      <span className="ambient-glow__veil" />
    </div>
  );
}
