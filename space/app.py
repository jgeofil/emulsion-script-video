"""Emulsion — script-to-screen Gradio Space.

Pipeline: script → cast → frames → motion → cut.
Each stage has its own Hugging Face / Grok model picker.
"""

from __future__ import annotations

import io
import json
import os
import tempfile
import time
from pathlib import Path
from typing import Any

import gradio as gr
import requests
from huggingface_hub import InferenceClient
from PIL import Image

XAI = "https://api.x.ai/v1"

SCRIPT_MODELS = [
    "grok-4.5",
    "Qwen/Qwen2.5-72B-Instruct",
    "meta-llama/Llama-3.3-70B-Instruct",
    "mistralai/Mistral-Small-24B-Instruct-2501",
    "google/gemma-3-27b-it",
]
IMAGE_MODELS = [
    "grok-imagine-image-2.0",
    "black-forest-labs/FLUX.1-schnell",
    "black-forest-labs/FLUX.1-dev",
    "Qwen/Qwen-Image",
    "stabilityai/stable-diffusion-3.5-large",
    "ByteDance/SDXL-Lightning",
]
VIDEO_MODELS = [
    "grok-imagine-video-1.5",
    "Lightricks/LTX-2.5",
    "Wan-AI/Wan2.2-I2V-A14B",
    "Wan-AI/Wan2.1-I2V-14B-480P",
    "Lightricks/LTX-Video",
    "THUDM/CogVideoX-5b-I2V",
]

BREAKDOWN_SYSTEM = """You are a film director's assistant. Return ONLY valid JSON:
{
  "title": string, "logline": string, "style": string,
  "characters": [{"name": string, "description": string, "wardrobe": string}],
  "scenes": [{"title": string, "location": string, "action": string,
              "dialogue": string, "camera": string, "duration": number,
              "characters": string[]}]
}
3-6 scenes. duration 4-8 seconds. style is a visual bible. No commentary."""

SAMPLE = """Title: Paper Birds

A quiet Kyoto workshop. Late afternoon light.

AIKO, a paper artist, folds a crane from white washi. Her hands are ink-stained.
The crane shivers. Paper wings catch the sun. It lifts off the wood.

Dusk. Over dark tiled rooftops a white crane glides, lanterns warming the alleys."""

CSS = """
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif&display=swap');
.gradio-container { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui !important; background: #0b0b0c !important; color: #f1eee8 !important; }
h1, h2, .prose h1 { font-family: 'Instrument Serif', serif !important; letter-spacing: -0.02em; }
footer { display: none !important; }
"""


def hf_token(override: str | None = None) -> str:
    return (override or os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACEHUB_API_TOKEN") or "").strip()


def xai_key() -> str:
    return (os.environ.get("XAI_API_KEY") or "").strip()


def parse_json(raw: str) -> dict[str, Any]:
    start, end = raw.find("{"), raw.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("Model did not return JSON")
    return json.loads(raw[start : end + 1])


def chat(model: str, system: str, prompt: str, token: str) -> str:
    if model.startswith("grok-"):
        key = xai_key()
        if not key:
            raise gr.Error("Set XAI_API_KEY as a Space secret to use Grok models.")
        res = requests.post(
            f"{XAI}/chat/completions",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json={
                "model": model,
                "temperature": 0.35,
                "max_tokens": 2400,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
            },
            timeout=120,
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]
    tok = hf_token(token)
    if not tok:
        raise gr.Error("Paste a Hugging Face token or set HF_TOKEN.")
    client = InferenceClient(api_key=tok)
    return client.chat_completion(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=2400,
        temperature=0.35,
    ).choices[0].message.content


def gen_image(model: str, prompt: str, token: str, refs: list[Image.Image] | None = None) -> Image.Image:
    if model.startswith("grok-"):
        key = xai_key()
        if not key:
            raise gr.Error("Set XAI_API_KEY as a Space secret to use Grok models.")
        if refs:
            buf = io.BytesIO()
            refs[0].save(buf, format="PNG")
            import base64

            b64 = base64.b64encode(buf.getvalue()).decode()
            res = requests.post(
                f"{XAI}/images/edits",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={
                    "model": model,
                    "prompt": prompt,
                    "image": {"url": f"data:image/png;base64,{b64}", "type": "image_url"},
                },
                timeout=180,
            )
        else:
            res = requests.post(
                f"{XAI}/images/generations",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"model": model, "prompt": prompt, "n": 1, "resolution": "1k"},
                timeout=180,
            )
        res.raise_for_status()
        url = res.json()["data"][0]["url"]
        img = requests.get(url, timeout=60)
        img.raise_for_status()
        return Image.open(io.BytesIO(img.content)).convert("RGB")

    tok = hf_token(token)
    if not tok:
        raise gr.Error("Paste a Hugging Face token or set HF_TOKEN.")
    client = InferenceClient(api_key=tok)
    out = client.text_to_image(prompt, model=model)
    return out.convert("RGB") if isinstance(out, Image.Image) else Image.open(out).convert("RGB")


def start_xai_video(prompt: str, frame: Image.Image | None, duration: int, refs: list[Image.Image]) -> str:
    key = xai_key()
    if not key:
        raise gr.Error("Set XAI_API_KEY as a Space secret to use Grok models.")
    import base64

    def as_data(im: Image.Image) -> str:
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

    body: dict[str, Any] = {
        "model": "grok-imagine-video-1.5",
        "prompt": prompt,
        "duration": max(4, min(8, int(duration))),
        "resolution": "480p",
        "aspect_ratio": "16:9",
    }
    if frame is not None:
        body["image"] = {"url": as_data(frame)}
    if refs:
        body["reference_images"] = [{"url": as_data(im)} for im in refs[:7]]
    res = requests.post(
        f"{XAI}/videos/generations",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json=body,
        timeout=60,
    )
    res.raise_for_status()
    return res.json()["request_id"]


def poll_xai_video(request_id: str) -> str:
    key = xai_key()
    for _ in range(90):
        res = requests.get(
            f"{XAI}/videos/{request_id}",
            headers={"Authorization": f"Bearer {key}"},
            timeout=30,
        )
        res.raise_for_status()
        data = res.json()
        status = (data.get("status") or "").lower()
        if status in {"done", "completed", "succeeded"}:
            url = data["video"]["url"]
            vid = requests.get(url, timeout=120)
            vid.raise_for_status()
            path = Path(tempfile.mkdtemp()) / "clip.mp4"
            path.write_bytes(vid.content)
            return str(path)
        if status in {"failed", "expired", "error"}:
            raise gr.Error(data.get("error") or "Video generation failed")
        time.sleep(4)
    raise gr.Error("Video timed out")


def hf_video(model: str, prompt: str, frame: Image.Image | None, token: str) -> str:
    tok = hf_token(token)
    if not tok:
        raise gr.Error("Paste a Hugging Face token or set HF_TOKEN.")
    client = InferenceClient(api_key=tok)
    extra: dict[str, Any] = {}
    if frame is not None:
        extra["image"] = frame
    try:
        out = client.text_to_video(prompt, model=model, **extra)
    except TypeError:
        out = client.text_to_video(prompt, model=model)
    path = Path(tempfile.mkdtemp()) / "clip.mp4"
    if isinstance(out, (bytes, bytearray)):
        path.write_bytes(out)
    elif isinstance(out, str) and out.startswith("http"):
        r = requests.get(out, timeout=120)
        r.raise_for_status()
        path.write_bytes(r.content)
    else:
        Path(out).replace(path)
    return str(path)


def breakdown(script: str, model: str, custom: str, token: str):
    model = (custom or "").strip() or model
    if len((script or "").strip()) < 20:
        raise gr.Error("Script is too short.")
    raw = chat(model, BREAKDOWN_SYSTEM, script, token)
    data = parse_json(raw)
    scenes = (data.get("scenes") or [])[:6]
    for s in scenes:
        s["duration"] = max(4, min(8, int(s.get("duration") or 5)))
    return (
        data.get("title") or "Untitled reel",
        data.get("logline") or "",
        data.get("style") or "",
        json.dumps(data.get("characters") or [], indent=2),
        json.dumps(scenes, indent=2),
    )


def generate_cast(chars_json: str, style: str, model: str, custom: str, token: str):
    model = (custom or "").strip() or model
    chars = json.loads(chars_json or "[]")
    gallery = []
    for c in chars[:6]:
        prompt = (
            f"Character reference sheet of {c.get('name')}: {c.get('description')}. "
            f"Wardrobe: {c.get('wardrobe')}. {style}. Photoreal cinematic still, no text."
        )
        gallery.append(gen_image(model, prompt, token))
    return gallery, json.dumps(chars, indent=2)


def generate_frames(scenes_json: str, chars_json: str, style: str, model: str, custom: str, token: str, sheets):
    model = (custom or "").strip() or model
    scenes = json.loads(scenes_json or "[]")
    chars = json.loads(chars_json or "[]")
    refs = [im for im in (sheets or []) if im is not None]
    gallery = []
    for s in scenes[:6]:
        names = ", ".join(s.get("characters") or [])
        prompt = (
            f"Cinematic 16:9 production still. {s.get('title')}. Location: {s.get('location')}. "
            f"Action: {s.get('action')}. Camera: {s.get('camera')}. Cast: {names}. {style}. "
            "Photoreal 35mm still, no captions."
        )
        gallery.append(gen_image(model, prompt, token, refs=refs[:5] or None))
    return gallery


def generate_clips(
    scenes_json: str,
    frames,
    sheets,
    style: str,
    model: str,
    custom: str,
    token: str,
    duration: int,
    progress=gr.Progress(),
):
    model = (custom or "").strip() or model
    scenes = json.loads(scenes_json or "[]")
    frames = frames or []
    refs = [im for im in (sheets or []) if im is not None]
    paths: list[str] = []
    n = max(1, min(len(scenes), len(frames), 6))
    for i in range(n):
        progress((i + 0.1) / n, desc=f"Scene {i + 1}")
        s = scenes[i]
        frame = frames[i]
        prompt = f"{s.get('camera', '')}. {s.get('action', '')}. {style}. Natural motion, no text."
        if model.startswith("grok-"):
            rid = start_xai_video(prompt, frame, duration or s.get("duration", 5), refs)
            paths.append(poll_xai_video(rid))
        else:
            paths.append(hf_video(model, prompt, frame, token))
    while len(paths) < 6:
        paths.append(None)
    return paths[:6]


def stitch(clips, transition: str, ins: list[float], outs: list[float]):
    from moviepy import VideoFileClip, concatenate_videoclips, vfx

    used = []
    for i, path in enumerate(clips or []):
        if not path:
            continue
        clip = VideoFileClip(path)
        start = max(0.0, float(ins[i] or 0))
        end = float(outs[i] or clip.duration)
        end = min(clip.duration, max(start + 0.1, end))
        piece = clip.subclipped(start, end)
        if transition == "crossfade" and used:
            piece = piece.with_effects([vfx.CrossFadeIn(0.4)])
        used.append(piece)
    if not used:
        raise gr.Error("Generate clips before conforming.")
    final = concatenate_videoclips(used, method="compose", padding=-0.4 if transition == "crossfade" else 0)
    out = Path(tempfile.mkdtemp()) / "emulsion.mp4"
    final.write_videofile(str(out), codec="libx264", audio=False, logger=None)
    for c in used:
        c.close()
    final.close()
    return str(out)


with gr.Blocks(css=CSS, title="Emulsion") as demo:
    gr.Markdown("# Emulsion\nScript to screen. Choose a model at every step.")
    token = gr.Textbox(label="Hugging Face token (optional if HF_TOKEN secret is set)", type="password")

    with gr.Tabs():
        with gr.Tab("01 Script"):
            script = gr.Textbox(label="Treatment", lines=12, value=SAMPLE)
            with gr.Row():
                script_model = gr.Dropdown(SCRIPT_MODELS, value=SCRIPT_MODELS[0], label="Breakdown model")
                script_custom = gr.Textbox(label="Custom model id", placeholder="org/model")
            btn_break = gr.Button("Break into scenes", variant="primary")
            title = gr.Textbox(label="Title")
            logline = gr.Textbox(label="Logline")
            style = gr.Textbox(label="Style bible", lines=3)
            chars_json = gr.Code(label="Characters JSON", language="json")
            scenes_json = gr.Code(label="Scenes JSON", language="json")
            btn_break.click(
                breakdown,
                [script, script_model, script_custom, token],
                [title, logline, style, chars_json, scenes_json],
            )

        with gr.Tab("02 Cast"):
            with gr.Row():
                char_model = gr.Dropdown(IMAGE_MODELS, value=IMAGE_MODELS[0], label="Character sheet model")
                char_custom = gr.Textbox(label="Custom model id")
            btn_cast = gr.Button("Generate character sheets", variant="primary")
            sheets = gr.Gallery(label="Sheets", columns=3, height=360)
            btn_cast.click(
                generate_cast,
                [chars_json, style, char_model, char_custom, token],
                [sheets, chars_json],
            )

        with gr.Tab("03 Frames"):
            with gr.Row():
                frame_model = gr.Dropdown(IMAGE_MODELS, value=IMAGE_MODELS[0], label="Still model")
                frame_custom = gr.Textbox(label="Custom model id")
            btn_frames = gr.Button("Generate scene stills", variant="primary")
            frames = gr.Gallery(label="Stills", columns=3, height=360)
            btn_frames.click(
                generate_frames,
                [scenes_json, chars_json, style, frame_model, frame_custom, token, sheets],
                [frames],
            )

        with gr.Tab("04 Motion"):
            with gr.Row():
                video_model = gr.Dropdown(VIDEO_MODELS, value=VIDEO_MODELS[0], label="Image-to-video model")
                video_custom = gr.Textbox(label="Custom model id")
            duration = gr.Slider(4, 8, value=5, step=1, label="Seconds per clip")
            btn_motion = gr.Button("Generate clips", variant="primary")
            clips = [gr.Video(label=f"Scene {i + 1}") for i in range(6)]
            btn_motion.click(
                generate_clips,
                [scenes_json, frames, sheets, style, video_model, video_custom, token, duration],
                clips,
            )

        with gr.Tab("05 Cut"):
            transition = gr.Radio(["cut", "crossfade"], value="cut", label="Transition")
            trims_in = [gr.Slider(0, 8, value=0, step=0.1, label=f"Scene {i + 1} in") for i in range(6)]
            trims_out = [gr.Slider(0, 8, value=5, step=0.1, label=f"Scene {i + 1} out") for i in range(6)]
            btn_cut = gr.Button("Conform reel", variant="primary")
            final = gr.Video(label="Final print")
            btn_cut.click(stitch, [clips, transition, trims_in, trims_out], [final])

if __name__ == "__main__":
    demo.queue().launch(server_name="0.0.0.0", server_port=int(os.environ.get("PORT", "7860")))
