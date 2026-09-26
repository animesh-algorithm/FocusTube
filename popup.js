const status = document.querySelector("#status");
const inputs = [...document.querySelectorAll('input[type="checkbox"]')];

async function loadSettings() {
  try {
    const { settings } = await chrome.storage.sync.get({ settings: DEFAULTS });
    const current = normalizeSettings(settings);
    inputs.forEach(input => { input.checked = current[input.name]; });
  } catch {
    status.textContent = "Could not load settings. Reopen Focus Tube to try again.";
  } finally {
    if (!status.textContent) inputs.forEach(input => { input.disabled = false; });
  }
}

document.querySelector("fieldset").addEventListener("change", async event => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const changedInput = event.target;
  const previousValue = !changedInput.checked;
  const settings = Object.fromEntries(inputs.map(input => [input.name, input.checked]));
  inputs.forEach(input => { input.disabled = true; });
  status.textContent = "Saving…";
  try {
    await chrome.storage.sync.set({ settings });
    status.textContent = "Saved";
  } catch {
    changedInput.checked = previousValue;
    status.textContent = "Could not save settings. Please try again.";
  } finally {
    inputs.forEach(input => { input.disabled = false; });
  }
});

loadSettings();
