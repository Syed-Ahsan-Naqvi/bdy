# Birthday Wish — Babuu (Zamar Zahra)

Premium scrollytelling birthday site built with **Next.js App Router**, **Tailwind CSS**, **Framer Motion**, and **React Three Fiber**.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sections

1. **HeroPuzzle** — scroll-pinned R3F photo fragments assemble into her portrait  
2. **ThoughtStory** — silhouette + glowing thought path + line-by-line memories  
3. **MemoryGallery** — vertical-to-horizontal polaroid lane with tilt  
4. **WishSection** — blowable candle, confetti, letter reveal, optional audio  

## Swap your content

| File | Purpose |
|------|---------|
| `public/portrait.jpg` | Hero puzzle + wall frame photo |
| `public/memory-1.jpg` … `memory-4.jpg` | Memory lane polaroids |
| `public/audio/bg.mp3` | Soft background track (optional — button appears when file loads) |
| `src/lib/content.ts` | Names, thoughts, captions, birthday letter |

## Stack notes

- R3F canvas is loaded with `dynamic(..., { ssr: false })`  
- `prefers-reduced-motion` short-circuits heavy scroll scrubbing  
- Keep photos reasonably sized (WebP/JPEG ~100–300KB) for mobile FPS  
