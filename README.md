# Focus Tube

Focus Tube lets you choose which distractions to hide on YouTube. The extension runs locally in Chrome, stores preferences with Chrome sync, and does not send browsing activity to a server.

See the [privacy policy](PRIVACY.md) for details.

## Features

- Hide comments and related videos on watch pages (enabled by default).
- Optionally hide descriptions and channel information.
- Optionally hide Shorts shelves, Shorts video cards, and Shorts navigation on desktop and mobile YouTube. Opening a Shorts URL while this option is enabled returns to YouTube's home page.
- Change settings from the toolbar popup; open YouTube tabs update without a reload.

YouTube changes its markup frequently. If a distraction reappears, report the page URL, browser version, and a screenshot through [GitHub issues](https://github.com/animesh-algorithm/FocusTube/issues).

## Install for development

1. Clone `https://github.com/animesh-algorithm/FocusTube.git`.
2. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
3. Choose **Load unpacked** and select the repository directory.
4. Open YouTube and use the Focus Tube toolbar popup to choose what to hide.

No build step or third-party packages are required. Run `node --test` for the automated checks. Reload the extension in `chrome://extensions` after editing source files.

## Architecture and permissions

- `manifest.json` loads the content script and CSS on `www.youtube.com` and `m.youtube.com` only.
- `settings.js` defines defaults and validates saved settings.
- `content.js` applies options to the document root and marks Shorts cards inserted by YouTube's dynamic navigation.
- `popup.html`, `popup.css`, and `popup.js` provide the settings UI.
- The only declared API permission is `storage`, used for preference sync. Content script site access is limited to YouTube. There is no background worker, remote script, analytics, or network request in the extension.

## Release

Package `manifest.json`, `settings.js`, `content.js`, `styles.css`, `popup.html`, `popup.css`, `popup.js`, and `icon.png` into a ZIP with `manifest.json` at the archive root. Test the packaged files in current Chrome, then upload the ZIP through the Chrome Web Store developer dashboard. Store listing copy is in [`store/listing.md`](store/listing.md). Confirm privacy disclosures and screenshots against the built package before submitting.

## Developer

Built by **Animesh Sharma**. [Portfolio](https://www.animesh.cc/) · [GitHub](https://github.com/animesh-algorithm) · [Contact](https://hire.animesh.cc/)
