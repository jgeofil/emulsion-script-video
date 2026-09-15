---
title: Emulsion
emoji: 🎞️
colorFrom: gray
colorTo: zinc
sdk: gradio
sdk_version: 5.49.1
app_file: app.py
pinned: false
license: mit
short_description: Script to screen video production with per-step HF models
---

# Emulsion

A Gradio Space for video production:

1. **Script** — break a treatment into scenes and a style bible
2. **Cast** — generate character sheets
3. **Frames** — generate a still per scene, using character references
4. **Motion** — image-to-video from each still
5. **Cut** — trim, order, and concatenate into a final reel

Each stage has its own Hugging Face (or Grok) model picker. Paste a custom
`org/model` id at any step.

## Secrets

- `HF_TOKEN` — Hugging Face token with Inference Providers
- `XAI_API_KEY` — optional, enables Grok 4.5 / Imagine models
