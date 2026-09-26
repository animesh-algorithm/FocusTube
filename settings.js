const DEFAULTS = Object.freeze({
  comments: true,
  recommendations: true,
  description: false,
  channelInfo: false,
  shorts: false
});

function normalizeSettings(value) {
  return Object.fromEntries(Object.keys(DEFAULTS).map(key => [key,
    typeof value?.[key] === "boolean" ? value[key] : DEFAULTS[key]
  ]));
}

if (typeof module !== "undefined") module.exports = { DEFAULTS, normalizeSettings };
