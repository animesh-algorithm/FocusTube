const preview = document.querySelector("#browser");
const viewButtons = document.querySelectorAll("[data-mode]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionEnabled = () => !reducedMotion.matches;
const activeAnimations = new Set();

function play(element, frames, options = {}) {
  if (!motionEnabled()) return;
  const animation = element.animate(frames, {
    duration: 1100,
    easing: "cubic-bezier(.16,1,.3,1)",
    ...options,
  });
  activeAnimations.add(animation);
  animation.finished
    .catch(() => {})
    .finally(() => activeAnimations.delete(animation));
  return animation;
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    preview.classList.toggle("focused", button.dataset.mode === "focused");
    viewButtons.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    play(
      preview,
      [
        { transform: "rotate(-4deg) scale(.93)", filter: "blur(3px)" },
        { transform: "rotate(2deg) scale(1.025)", filter: "blur(0)" },
        { transform: "rotate(-1deg) scale(1)", filter: "blur(0)" },
      ],
      { duration: 850 },
    );
  });
});

// Each heading keeps its text and line breaks; words get a staggered entrance.
const wordGroups = [];
document.querySelectorAll("h1, h2").forEach((heading) => {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    if (
      !walker.currentNode.parentElement.closest('svg, [aria-hidden="true"]') &&
      walker.currentNode.textContent.trim()
    )
      nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part.trim()) fragment.append(document.createTextNode(part));
      else {
        const span = document.createElement("span");
        span.className = "motion-word";
        span.textContent = part;
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
  wordGroups.push(heading);
});

const revealTargets = document.querySelectorAll(
  ".feature, .review-grid figure, .price-card, .note-paper, .rating, .privacy-art, .developer-mark",
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const words = entry.target.querySelectorAll(".motion-word");
      if (words.length) {
        words.forEach((word, index) =>
          play(
            word,
            [
              {
                transform: "translateY(100px) rotate(12deg) scale(.75)",
                opacity: 0,
              },
              {
                transform: "translateY(-9px) rotate(-2deg) scale(1.035)",
                opacity: 1,
                offset: 0.72,
              },
              { transform: "none", opacity: 1 },
            ],
            { delay: index * 65, fill: "backwards" },
          ),
        );
      } else {
        const index = Array.from(entry.target.parentElement.children).indexOf(
          entry.target,
        );
        play(
          entry.target,
          [
            {
              transform: "translateY(130px) rotate(-9deg) scale(.8)",
              opacity: 0,
            },
            {
              transform: "translateY(-12px) rotate(2deg) scale(1.02)",
              opacity: 1,
              offset: 0.75,
            },
            { transform: getComputedStyle(entry.target).transform, opacity: 1 },
          ],
          {
            duration: 1300,
            delay: Math.min(index * 130, 390),
            fill: "backwards",
          },
        );
      }
    });
  },
  { threshold: 0.12 },
);
[...wordGroups, ...revealTargets].forEach((target) => observer.observe(target));

// One animation frame per scroll event, with no scroll hijacking.
const demo = document.querySelector(".demo-wrap");
const waves = document.querySelectorAll(".section-wave svg");
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  if (!motionEnabled() || document.hidden) return;
  const box = demo.getBoundingClientRect();
  const progress = Math.max(
    -1,
    Math.min(1, (innerHeight / 2 - box.top) / innerHeight),
  );
  demo.style.setProperty("--demo-y", `${progress * -38}px`);
  demo.style.setProperty("--demo-rotate", `${progress * 3}deg`);
  waves.forEach((wave, index) => {
    const bounds = wave.parentElement.getBoundingClientRect();
    if (bounds.top < innerHeight + 80 && bounds.bottom > -80) {
      wave.style.transform = `scaleY(${1 + Math.sin(scrollY * 0.004 + index) * 0.35})`;
      wave.style.transformOrigin = "bottom";
    }
  });
}
function requestScrollUpdate() {
  if (!scrollFrame && motionEnabled())
    scrollFrame = requestAnimationFrame(updateScroll);
}
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });

// Hover feedback is reserved for pointer devices; touch scrolling stays native.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document
    .querySelectorAll(".review-grid figure, .feature-visual")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (!motionEnabled()) return;
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.rotate = `${x * 8}deg`;
        card.style.translate = `${x * 8}px ${y * 8}px`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.rotate = "";
        card.style.translate = "";
      });
    });
}

function syncMotion() {
  document.documentElement.classList.toggle(
    "reduced-motion",
    reducedMotion.matches,
  );
  document.documentElement.classList.toggle("page-hidden", document.hidden);
  for (const animation of activeAnimations) {
    if (reducedMotion.matches) animation.finish();
    else if (document.hidden) animation.pause();
    else animation.play();
  }
  if (reducedMotion.matches) {
    demo.style.removeProperty("--demo-y");
    demo.style.removeProperty("--demo-rotate");
    waves.forEach((wave) => wave.style.removeProperty("transform"));
    document
      .querySelectorAll(".feature-visual, .review-grid figure")
      .forEach((card) => {
        card.style.rotate = "";
        card.style.translate = "";
      });
  } else requestScrollUpdate();
}
reducedMotion.addEventListener("change", syncMotion);
document.addEventListener("visibilitychange", syncMotion);
syncMotion();
