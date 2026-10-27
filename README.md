# Shwe's Interactive Portfolio — v1

Editable React + Three.js homepage with a dark-purple galaxy atmosphere and **Shwe's Personal Assistant**. The avatar artwork is cropped from Shwe's own uploaded Apple Memoji screenshots.

## Start on Windows

1. Extract this ZIP to a folder (do not run npm inside the ZIP viewer).
2. In the extracted folder containing `package.json`, open PowerShell.
3. Run `npm install` and then `npm run dev`.
4. Visit the localhost address printed by Vite (usually http://localhost:5173/).

## Your edits

- `src/portfolio-data.js`: name, bio, projects, skills and URLs.
- `src/intro-config.js`: spoken introduction and voice preferences.
- `src/style.css`: background and theme colors, sizing and layout.
- `public/memoji/`: your own Memoji art frames.

## What works now

- Dark-purple hero, WebGL orbital line art and particles, responsive sections.
- Button-triggered spoken introduction via Web Speech API; voice availability varies by browser and OS.
- Corner assistant, typed Q&A using clearly marked **scripted** answers, speech toggle and expression-frame changes.
- Avatar visual effects are **2D image animations**, not a real-time 3D Apple Memoji rig or phoneme-perfect lip-sync.

## Still to build

- Proper facial rig/lip-sync from an animatable character or expression frames.
- Natural AI-generated female speech provider (requires API integration, server endpoint and potentially a usage fee).
- Secure AI Q&A retrieval from your verified resume and GitHub data (do not put API keys in frontend files).
- Your verified portfolio content, working links, resume and professional details.

This draft intentionally does not invent career accomplishments. Do not deploy with unfinished placeholder information.
