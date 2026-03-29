# Zahid Speed Pro

A clean, light‑theme internet speed test you can share with anyone.

## What it does

Zahid Speed Pro helps you quickly understand your connection quality with a simple “GO” test and easy-to-read results.

## Features

- **One‑tap speed test**: Start instantly and watch results update live.
- **Download & upload results**: See how fast you can receive and send data.
- **Latency & jitter**: Understand responsiveness for calls, gaming, and real‑time apps.
- **Live speed graph**: Visual timeline while the test is running.
- **Network health badge**: Simple quality indicator (Excellent / Good / Unstable).
- **History**: Keeps recent results so you can compare runs.
- **Shareable report**: Copy a clean text summary to send to support or friends.
- **Mobile‑first UI**: Works great on phones, tablets, and desktop.
- **Always light theme**: No dark mode — white, clean, consistent.

## Quick start (local)

```bash
npm install
npm run dev
```

Open the link shown in the terminal, then press **GO**.

## Deploy on Vercel

This repo is prepped for Vercel (Vite + SPA rewrites).

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel, click **Add New → Project** and import the repo.
3. Keep the defaults:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

## Notes

- **History is stored on the device** (browser storage). Clearing site data clears the history.
- Results are a **simulation profile** for demo/testing and UI experience.

