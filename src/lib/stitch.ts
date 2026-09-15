import type { Scene, TransitionKind, AspectRatio } from "./types";
import { ASPECT_PIXELS } from "./models";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitEvent(target: EventTarget, name: string) {
  return new Promise<void>((resolve, reject) => {
    const ok = () => {
      cleanup();
      resolve();
    };
    const err = () => {
      cleanup();
      reject(new Error(`Media ${name} failed`));
    };
    const cleanup = () => {
      target.removeEventListener(name, ok);
      target.removeEventListener("error", err);
    };
    target.addEventListener(name, ok, { once: true });
    target.addEventListener("error", err, { once: true });
  });
}

function pickMime(): string {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const t of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t))
      return t;
  }
  return "video/webm";
}

export function mediaProxyUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:"))
    return url;
  return `/api/media?u=${encodeURIComponent(url)}`;
}

export async function stitchScenes(
  scenes: Scene[],
  opts: { aspect: AspectRatio; transition: TransitionKind },
  onProgress?: (p: number) => void,
): Promise<Blob> {
  const clips = scenes.filter((s) => s.included && s.videoUrl);
  if (clips.length === 0) throw new Error("No clips to cut.");

  const { w, h } = ASPECT_PIXELS[opts.aspect];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const stream = canvas.captureStream(30);
  const mime = pickMime();
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });
  recorder.start(200);

  const fade = opts.transition === "crossfade" ? 0.4 : 0;
  const videos: HTMLVideoElement[] = [];

  try {
    for (let i = 0; i < clips.length; i++) {
      const scene = clips[i];
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = mediaProxyUrl(scene.videoUrl!);
      videos.push(video);
      await waitEvent(video, "loadedmetadata");
      const start = Math.min(scene.trimIn, video.duration - 0.05);
      const end = Math.min(Math.max(scene.trimOut, start + 0.1), video.duration);
      video.currentTime = start;
      await waitEvent(video, "seeked");
      await video.play();

      const next = clips[i + 1];
      let nextVideo: HTMLVideoElement | null = null;
      if (fade > 0 && next?.videoUrl) {
        nextVideo = document.createElement("video");
        nextVideo.crossOrigin = "anonymous";
        nextVideo.muted = true;
        nextVideo.playsInline = true;
        nextVideo.src = mediaProxyUrl(next.videoUrl);
        videos.push(nextVideo);
        await waitEvent(nextVideo, "loadedmetadata");
        nextVideo.currentTime = next.trimIn;
      }

      while (!video.paused && video.currentTime < end) {
        ctx.fillStyle = "#0b0b0c";
        ctx.fillRect(0, 0, w, h);
        drawCover(ctx, video, w, h);
        const remaining = end - video.currentTime;
        if (nextVideo && remaining < fade) {
          const t = 1 - remaining / fade;
          ctx.save();
          ctx.globalAlpha = Math.min(1, Math.max(0, t));
          if (nextVideo.paused) {
            try {
              await nextVideo.play();
            } catch {
              /* ignore */
            }
          }
          drawCover(ctx, nextVideo, w, h);
          ctx.restore();
        }
        onProgress?.((i + (video.currentTime - start) / (end - start)) / clips.length);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
      }
      video.pause();
      nextVideo?.pause();
    }
    await sleep(80);
    recorder.stop();
    await stopped;
  } finally {
    for (const v of videos) {
      v.pause();
      v.src = "";
    }
    stream.getTracks().forEach((t) => t.stop());
  }

  return new Blob(chunks, { type: mime.split(";")[0] });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
) {
  const vw = video.videoWidth || w;
  const vh = video.videoHeight || h;
  const scale = Math.max(w / vw, h / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
