import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelPicker } from "./model-picker";
import { generateStill } from "@/lib/generation";
import { getHfToken, useStudio } from "@/lib/store";
import { modelNeedsHf, resolveModelId } from "@/lib/models";
import type { Scene } from "@/lib/types";

export function FramesStep() {
  const project = useStudio((s) => s.project);
  const busy = useStudio((s) => Boolean(s.busy.frames));

  async function generateAll() {
    const { setBusy, updateScene } = useStudio.getState();
    const model = resolveModelId(project.models.frame, project.customModels.frame);
    if (modelNeedsHf("frame", model) && !getHfToken()) {
      toast.error("This model needs a Hugging Face token in settings.");
      return;
    }
    setBusy("frames", true);
    try {
      for (const scene of useStudio.getState().project.scenes) {
        const chars = project.characters.filter((c) =>
          scene.characterIds.includes(c.id),
        );
        const res = await generateStill({
          data: {
            kind: "frame",
            model,
            hfToken: getHfToken() || undefined,
            aspect: project.aspect,
            scene,
            characters: chars,
            style: project.style,
            refs: chars.map((c) => c.imageUrl).filter((u): u is string => Boolean(u)),
          },
        });
        if (!res.ok) {
          toast.error(`${scene.title}: ${res.error}`);
          continue;
        }
        updateScene(scene.id, { frameUrl: res.url, framePrompt: res.prompt });
      }
    } finally {
      setBusy("frames", false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
            Take 03
          </p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">Frames</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-64 max-w-full">
            <ModelPicker task="frame" label="Still model" />
          </div>
          <Button disabled={busy || project.scenes.length === 0} onClick={() => void generateAll()}>
            {busy ? "Exposing stills…" : "Generate all stills"}
          </Button>
        </div>
      </div>
      {project.scenes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
          Break the script into scenes first.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.scenes.map((s) => (
            <FrameCard key={s.id} scene={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function FrameCard({ scene }: { scene: Scene }) {
  const project = useStudio((s) => s.project);
  const update = useStudio((s) => s.updateScene);
  const busy = useStudio((s) => Boolean(s.busy[`frame:${scene.id}`]));
  const setBusy = useStudio((s) => s.setBusy);
  const chars = project.characters.filter((c) =>
    scene.characterIds.includes(c.id),
  );

  async function generateOne() {
    const model = resolveModelId(project.models.frame, project.customModels.frame);
    if (modelNeedsHf("frame", model) && !getHfToken()) {
      toast.error("This model needs a Hugging Face token in settings.");
      return;
    }
    setBusy(`frame:${scene.id}`, true);
    try {
      const res = await generateStill({
        data: {
          kind: "frame",
          model,
          hfToken: getHfToken() || undefined,
          aspect: project.aspect,
          scene,
          characters: chars,
          style: project.style,
          refs: chars.map((c) => c.imageUrl).filter((u): u is string => Boolean(u)),
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      update(scene.id, { frameUrl: res.url, framePrompt: res.prompt });
    } finally {
      setBusy(`frame:${scene.id}`, false);
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="relative bg-raised">
        {scene.frameUrl ? (
          <img
            src={scene.frameUrl}
            alt=""
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-xs text-subtle">
            No still
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-bg/80">
          Scene {String(scene.index).padStart(2, "0")}
        </Badge>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-display text-xl">{scene.title}</h3>
        <p className="text-xs leading-relaxed text-muted">{scene.action}</p>
        <p className="font-mono text-[10px] tracking-wide text-subtle">
          {chars.map((c) => c.name).join(" · ") || "No cast"}
        </p>
        <Button size="sm" disabled={busy} onClick={() => void generateOne()}>
          {busy ? "Exposing…" : scene.frameUrl ? "Reshoot still" : "Shoot still"}
        </Button>
      </div>
    </article>
  );
}
