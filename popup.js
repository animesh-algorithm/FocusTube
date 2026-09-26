const status = document.querySelector("#status");
const inputs = [...document.querySelectorAll('input[type="checkbox"]')];

chrome.storage.sync.get({ settings: DEFAULTS }, ({ settings }) => {
  const current = normalizeSettings(settings);
  inputs.forEach(input => { input.checked = current[input.name]; });
});

document.querySelector("fieldset").addEventListener("change", async event => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const settings = Object.fromEntries(inputs.map(input => [input.name, input.checked]));
  try {
    await chrome.storage.sync.set({ settings });
    status.textContent = "Saved";
  } catch {
    status.textContent = "Could not save settings. Please try again.";
  }
});
