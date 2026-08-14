(() => {
  const gate = document.getElementById("gate");
  const openBtn = document.getElementById("openGate");
  const story = document.getElementById("story");
  const finale = document.getElementById("finale");
  const heartsRoot = document.getElementById("hearts");
  const progressEl = document.getElementById("progress");
  const hero = document.querySelector('[data-scene="hero"]');
  const letterScene = document.querySelector('[data-scene="letter"]');
  const nicksScene = document.querySelector('[data-scene="nicks"]');
  const letterLines = [...document.querySelectorAll("[data-scrub]")];
  const nickItems = [...document.querySelectorAll("[data-nick-scrub]")];
  const parallaxFigs = [...document.querySelectorAll("[data-parallax]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;
  let storyOpen = false;

  function clamp(n, a = 0, b = 1) {
    return Math.min(b, Math.max(a, n));
  }

  function sceneProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return clamp(-rect.top / Math.max(rect.height, 1));
    return clamp(-rect.top / total);
  }

  function setScrubState(items, progress) {
    const n = items.length;
    if (!n) return;
    if (progress >= 0.97) {
      items.forEach((el) => {
        el.classList.add("is-active");
        el.classList.remove("is-passed");
      });
      return;
    }
    const idx = Math.min(n - 1, Math.floor(progress * n));
    items.forEach((el, i) => {
      const active = progress > 0.04 && i === idx;
      const passed = i < idx;
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-passed", passed);
    });
  }

  function updateScrollMotion() {
    if (!storyOpen || reduceMotion) return;

    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const scrollP = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    doc.style.setProperty("--scroll-p", String(clamp(scrollP)));

    if (hero) {
      const hr = hero.getBoundingClientRect();
      const p = clamp(-hr.top / Math.max(hr.height * 0.85, 1));
      hero.style.setProperty("--hero-p", String(p));
    }

    setScrubState(letterLines, sceneProgress(letterScene));
    setScrubState(nickItems, sceneProgress(nicksScene));

    const mid = window.innerHeight * 0.5;
    for (const fig of parallaxFigs) {
      const r = fig.getBoundingClientRect();
      const center = r.top + r.height * 0.5;
      const para = clamp((center - mid) / window.innerHeight, -1, 1);
      fig.style.setProperty("--para", String(para));
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollMotion();
      ticking = false;
    });
  }

  function unlockStory() {
    if (!gate || !story) return;
    gate.classList.add("is-open");
    story.hidden = false;
    story.classList.remove("is-locked");
    document.body.style.overflow = "";
    storyOpen = true;
    if (progressEl) progressEl.classList.add("is-on");
    window.setTimeout(() => {
      gate.setAttribute("aria-hidden", "true");
      gate.style.display = "none";
      updateScrollMotion();
    }, 700);
  }

  if (openBtn) {
    openBtn.addEventListener("click", unlockStory, { once: true });
  }

  if (gate && !gate.classList.contains("is-open")) {
    document.body.style.overflow = "hidden";
  }

  function observeReveals() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((el) => io.observe(el));
  }

  function spawnHearts() {
    if (!heartsRoot || reduceMotion || heartsRoot.dataset.done === "1") return;
    heartsRoot.dataset.done = "1";
    const count = 18;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      h.style.setProperty("--s", `${10 + Math.random() * 16}px`);
      h.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
      h.style.setProperty("--dur", `${2.2 + Math.random() * 1.6}s`);
      h.style.setProperty("--delay", `${Math.random() * 0.55}s`);
      frag.appendChild(h);
    }
    heartsRoot.appendChild(frag);
    requestAnimationFrame(() => {
      if (finale) finale.classList.add("is-burst");
    });
  }

  function observeFinale() {
    if (!finale) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      spawnHearts();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          spawnHearts();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(finale);
  }

  if (!reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  } else {
    letterLines.forEach((el) => el.classList.add("is-active"));
    nickItems.forEach((el) => el.classList.add("is-active"));
  }

  observeReveals();
  observeFinale();
})();
