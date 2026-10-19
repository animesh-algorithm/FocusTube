# FocusTube marketing site

Static HTML, CSS, and a small script for the illustrative before/after preview. No build step or application dependencies.

## Local preview

From the repository root, run `python3 -m http.server 4173 --directory website` and open http://localhost:4173.

## Vercel

Project: `focustube` in `animeshs-projects-c0bef823`. Set the project root directory to `website`, framework to Other, no build command, and output directory to `.`. Deploy from the repository root with the project linked there. The website is isolated from the extension package.

## Content maintenance

Ratings and testimonials in `index.html` were checked against the Chrome Web Store with All languages selected on October 19, 2026: 4.2/5 from 6 ratings. The page features three selected positive reviews in English and Spanish, preserving original spelling, author, date, and rating, and links to all reviews. This is a dated snapshot, not a live review feed; update both rating displays and the snapshot date together.

The browser preview is an illustration, not a screenshot or an embedded YouTube video. It does not install or run the extension. Every installation CTA opens the real store link. The developer support CTA uses https://link.animesh.cc/coffee.

## Motion and artwork

The website uses native Web Animations, CSS keyframes, and one requestAnimationFrame scroll update, without an animation framework. Scroll entrances reveal heading words and cards; the demo tilts with scroll; illustrations and ticker animate continuously. Off-tab animations pause, and the system reduced-motion preference disables motion. The content remains visible when JavaScript is unavailable.

The full-color Chrome logo is stored locally in `assets/chrome.svg`, sourced from Google's Chrome website: https://www.google.com/chrome/static/images/chrome-logo-m100.svg. Installation buttons still open the Chrome Web Store. Sine-wave section dividers are inline SVG paths, and appear below every section, including the final section.
