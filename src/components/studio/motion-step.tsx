import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModelPicker } from "./model-picker";
import { pollClip, startClip } from "@/lib/generation";
import { getHfToken, useStudio } from "@/lib/store";
import { modelNeedsHf, resolveModelId } from "@/lib/models";
import { mediaProxyUrl } from "@/lib/stitch";
import { sceneMotionPrompt } from "@/lib/prompts";
import type { Scene } from "@/lib/types";

export function MotionStep() {
  const project = useStudio((s) => s.project);
  const busy = useStudio((s) => Boolean(s.busy.motion));

  async function generateAll() {
    const { setBusy } = useStudio.getState();
    setBusy("motion", true);
    try {
      for (const scene of useStudio.getState().project.scenes) {
        if (!scene.frameUrl) {
          toast.error(`Scene ${scene.index} needs a still first.`);
          continue;
        }
        await generateScene(scene.id);
      }
    } finally {
      setBusy("motion", false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
            Take 04
          </p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">Motion</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-64 max-w-full">
            <ModelPicker task="video" label="Image-to-video model" />
          </div>
          <Button disabled={busy || project.scenes.length === 0} onClick={() => void generateAll()}>
            {busy ? "Rolling…" : "Generate all clips"}
          </Button>
        </div>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        Each still becomes a short clip. Character sheets are passed as
        references when the model allows it. Clips stay at 4–8 seconds.
      </p>
      {project.scenes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
          Shoot stills before rolling motion.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {project.scenes.map((s) => (
            <MotionCard key={s.id} scene={s} />
          ))}
        </div>
      )}
    </div>
  );
}

async function generateScene(id: string) {
  const state = useStudio.getState();
  const project = state.project;
  const scene = project.scenes.find((s) => s.id === id);
  if (!scene) return;
  const model = resolveModelId(project.models.video, project.customModels.video);
  if (modelNeedsHf("video", model) && !getHfToken()) {
    toast.error("This model needs a Hugging Face token in settings.");
    return;
  }
  if (!scene.frameUrl) {
    toast.error("Shoot a still for this scene first.");
    return;
  }
  state.setBusy(`clip:${id}`, true);
  state.updateScene(id, { videoStatus: "running", videoError: undefined });
  try {
    const chars = project.characters.filter((c) =>
      scene.characterIds.includes(c.id),
    );
    const res = await startClip({
      data: {
        model,
        hfToken: getHfToken() || undefined,
        scene,
        characters: chars,
        style: project.style,
        aspect: project.aspect,
        resolution: project.resolution,
      },
    });
    if (!res.ok) {
      state.updateScene(id, { videoStatus: "error", videoError: res.error });
      toast.error(res.error);
      return;
    }
    state.updateScene(id, { videoPrompt: res.prompt });
    if (res.immediate && res.url) {
      state.updateScene(id, {
        videoUrl: res.url,
        videoStatus: "done",
        trimOut: scene.duration,
      });
      return;
    }
    state.updateScene(id, { videoRequestId: res.requestId, videoStatus: "running" });
  } catch (err) {
    state.updateScene(id, {
      videoStatus: "error",
      videoError: err instanceof Error ? err.message : "Failed",
    });
  } finally {
    state.setBusy(`clip:${id}`, false);
  }
}

function MotionCard({ scene }: { scene: Scene }) {
  const project = useStudio((s) => s.project);
  const update = useStudio((s) => s.updateScene);
  const busy = useStudio((s) => Boolean(s.busy[`clip:${scene.id}`]));
  const chars = project.characters.filter((c) =>
    scene.characterIds.includes(c.id),
  );

  useEffect(() => {
    if (!scene.videoRequestId || scene.videoStatus !== "running") return;
    let stop = false;
    const model = resolveModelId(project.models.video, project.customModels.video);
    const tick = async () => {
      const res = await pollClip({
        data: { requestId: scene.videoRequestId!, model },
      });
      if (stop) return;
      if (!res.ok) {
        update(scene.id, { videoStatus: "error", videoError: res.error });
        return;
      }
      if (res.status === "done" && res.url) {
        update(scene.id, {
          videoUrl: res.url,
          videoStatus: "done",
          videoRequestId: undefined,
          trimOut: scene.duration,
        });
        return;
      }
      if (res.status === "failed") {
        update(scene.id, {
          videoStatus: "error",
          videoError: res.error ?? "Generation failed",
          videoRequestId: undefined,
        });
        return;
      }
      window.setTimeout(() => void tick(), 4000);
    };
    void tick();
    return () => {
      stop = true;
    };
  }, [scene.videoRequestId, scene.videoStatus, scene.id, scene.duration, project.models.video, project.customModels.video, update]);

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-surface p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="overflow-hidden rounded-md bg-raised">
        {scene.videoUrl ? (
          <video
            src={mediaProxyUrl(scene.videoUrl)}
            controls
            playsInline
            className="aspect-video w-full bg-bg"
          />
        ) : scene.frameUrl ? (
          <img src={scene.frameUrl} alt="" className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center text-xs text-subtle">
            No plate
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge>Scene {String(scene.index).padStart(2, "0")}</Badge>
          <span className="font-mono text-xs text-subtle">
            {scene.videoStatus === "running"
              ? "In process"
              : scene.videoStatus === "error"
                ? "Failed"
                : scene.videoUrl
                  ? "Print"
                  : "Idle"}
          </span>
        </div>
        <h3 className="font-display text-2xl">{scene.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{scene.camera}</p>
        {scene.videoError && (
          <p className="text-sm text-danger">{scene.videoError}</p>
        )}
        <div className="flex flex-col gap-2">
          <Label>Duration (seconds)</Label>
          <Input
            type="number"
            min={4}
            max={8}
            value={scene.duration}
            onChange={(e) => {
              const d = Math.min(8, Math.max(4, Number(e.target.value) || 5));
              update(scene.id, { duration: d, trimOut: d });
            }}
          />
        </div>
        <p className="line-clamp-3 font-mono text-[11px] leading-relaxed text-subtle">
          {scene.videoPrompt ||
            sceneMotionPrompt(scene, chars, project.style)}
        </p>
        <Button
          disabled={busy || scene.videoStatus === "running"}
          onClick={() => void generateScene(scene.id)}
        >
          {scene.videoStatus === "running"
            ? "Processing…"
            : scene.videoUrl
              ? "Reshoot clip"
              : "Roll clip"}
        </Button>
      </div>
    </article>
  );
}
