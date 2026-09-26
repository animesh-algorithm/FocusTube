// Settings apply through a root attribute so newly inserted YouTube nodes inherit the rules.
const ROOT = document.documentElement;
const SHORTS_LINK = 'a[href^="/shorts/"]';
let settings = null;
let observer = null;
let scheduled = false;
let changedSinceInit = false;

function isShortsPage() {
  return location.pathname === "/shorts" || location.pathname.startsWith("/shorts/");
}

function isShortsCard(link) {
  return link.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer');
}

function markShortsCards() {
  document.querySelectorAll("[data-focus-tube-shorts-card]").forEach(card => {
    if (!card.querySelector(SHORTS_LINK)) card.removeAttribute("data-focus-tube-shorts-card");
  });
  document.querySelectorAll(SHORTS_LINK).forEach(link => {
    const card = isShortsCard(link);
    if (card) card.setAttribute("data-focus-tube-shorts-card", "");
  });
}

function scheduleShortsScan() {
  if (scheduled || !settings?.shorts) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    markShortsCards();
  });
}

function applySettings(next) {
  settings = normalizeSettings(next);
  for (const [key, enabled] of Object.entries(settings)) {
    ROOT.toggleAttribute(`data-focus-tube-${key.toLowerCase()}`, enabled);
  }
  if (settings.shorts) {
    if (isShortsPage()) {
      location.replace("/");
      return;
    }
    markShortsCards();
    if (!observer) {
      observer = new MutationObserver(scheduleShortsScan);
      observer.observe(ROOT, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    }
  } else {
    observer?.disconnect();
    observer = null;
    document.querySelectorAll("[data-focus-tube-shorts-card]").forEach(node => node.removeAttribute("data-focus-tube-shorts-card"));
  }
}

document.addEventListener("yt-navigate-finish", () => {
  if (settings?.shorts && isShortsPage()) location.replace("/");
  else scheduleShortsScan();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.settings) {
    changedSinceInit = true;
    applySettings(changes.settings.newValue);
  }
});
chrome.storage.sync.get({ settings: DEFAULTS }).then(data => {
  if (!changedSinceInit) applySettings(data.settings);
}).catch(() => {
  if (!changedSinceInit) applySettings(DEFAULTS);
});
