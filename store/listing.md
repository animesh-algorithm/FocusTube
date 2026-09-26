# Chrome Web Store listing draft

**Name:** Focus Tube

**Short description:** Choose which YouTube distractions to hide, including Shorts, comments, and related videos.

**Detailed description:**

Focus Tube helps you watch YouTube with fewer distractions. Use its toolbar popup to choose what you want to hide. Comments and related videos are hidden by default; descriptions, channel information, and Shorts are optional.

When Shorts hiding is enabled, Focus Tube hides Shorts shelves, Shorts video cards, and Shorts navigation across supported desktop and mobile YouTube pages. Opening a Shorts URL returns you to YouTube's home page. Settings update open tabs automatically.

Your preferences are saved with Chrome sync. Focus Tube does not collect browsing activity, use analytics, or send data to a developer server.

Developed by Animesh Sharma: https://www.animesh.cc/
Support and updates: https://github.com/animesh-algorithm/FocusTube

**Single purpose:** Allow users to hide selected YouTube distractions.

**Permission rationale:** `storage` saves users' selected options with Chrome sync.

**Host access rationale:** The content script runs only on `www.youtube.com` and `m.youtube.com` to hide selected distractions on those pages.

**Privacy disclosure:** The extension contains no developer-controlled data collection. Chrome may sync settings under the user's browser account.

**Privacy policy URL:** https://github.com/animesh-algorithm/FocusTube/blob/master/PRIVACY.md

**Review prompt:** The popup includes a quiet, optional link to the Chrome Web Store reviews page. It asks for no specific rating and provides no incentive.
