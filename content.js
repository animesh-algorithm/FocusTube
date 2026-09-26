// Settings apply through a root attribute so newly inserted YouTube nodes inherit the rules.
const ROOT = document.documentElement;
const SHORTS_LINK = 'a[href^="/shorts/"]';
let settings = null;
let observer = null;
let scheduled = false;

function isShortsCard(link) {
  return link.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-rich-item-renderer');
}

function markShortsCards() {
  document.querySelectorAll("[data-focus-tube-shorts]").forEach(card => {
    if (!card.querySelector(SHORTS_LINK)) card.removeAttribute("data-focus-tube-shorts");
  });
  document.querySelectorAll(SHORTS_LINK).forEach(link => {
    const card = isShortsCard(link);
    if (card) card.setAttribute("data-focus-tube-shorts", "");
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
    if (location.pathname.startsWith("/shorts")) {
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
    document.querySelectorAll("[data-focus-tube-shorts]").forEach(node => node.removeAttribute("data-focus-tube-shorts"));
  }
}

document.addEventListener("yt-navigate-finish", () => {
  if (settings?.shorts && location.pathname.startsWith("/shorts")) location.replace("/");
  else scheduleShortsScan();
});

chrome.storage.sync.get({ settings: DEFAULTS }, data => applySettings(data.settings));
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.settings) applySettings(changes.settings.newValue);
});
