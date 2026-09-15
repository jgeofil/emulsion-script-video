import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ModelPicker } from "./model-picker";
import { breakdownScript } from "@/lib/generation";
import { getHfToken, useStudio } from "@/lib/store";
import { SAMPLE_SCRIPT } from "@/lib/sample-project";
import { modelNeedsHf, resolveModelId } from "@/lib/models";
import { Badge } from "@/components/ui/badge";

export function ScriptStep() {
  const project = useStudio((s) => s.project);
  const patch = useStudio((s) => s.patchProject);
  const apply = useStudio((s) => s.applyBreakdown);
  const busy = useStudio((s) => s.busy.script);
  const setBusy = useStudio((s) => s.setBusy);

  async function runBreakdown() {
    const model = resolveModelId(project.models.script, project.customModels.script);
    if (modelNeedsHf("script", model) && !getHfToken()) {
      toast.error("This model needs a Hugging Face token in settings.");
      return;
    }
    setBusy("script", true);
    try {
      const res = await breakdownScript({
        data: {
          script: project.script,
          model,
          hfToken: getHfToken() || undefined,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      apply({
        ...project,
        title: res.title,
        logline: res.logline,
        style: res.style || project.style,
        characters: res.characters,
        scenes: res.scenes,
      });
      toast.success(`${res.scenes.length} scenes on the slate`);
    } finally {
      setBusy("script", false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
              Take 01
            </p>
            <h2 className="mt-1 font-display text-3xl md:text-4xl">Script</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => patch({ script: SAMPLE_SCRIPT })}
          >
            Load sample pages
          </Button>
        </div>
        <Textarea
          value={project.script}
          onChange={(e) => patch({ script: e.target.value })}
          placeholder="Paste a treatment or scene list. Keep it short — six scenes or fewer."
          className="min-h-72 font-[inherit] leading-relaxed"
          aria-label="Script"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={project.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="logline">Logline</Label>
            <Input
              id="logline"
              value={project.logline}
              onChange={(e) => patch({ logline: e.target.value })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="style">Style bible</Label>
          <Textarea
            id="style"
            className="min-h-24"
            value={project.style}
            onChange={(e) => patch({ style: e.target.value })}
            placeholder="Lens, grain, palette, era — applied to every still and clip."
          />
        </div>
      </div>
      <aside className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5">
        <ModelPicker task="script" label="Breakdown model" />
        <Button disabled={busy} onClick={() => void runBreakdown()}>
          {busy ? "Reading pages…" : "Break into scenes"}
        </Button>
        <p className="text-sm leading-relaxed text-muted">
          The model returns a cast list, a visual bible, and up to six scenes
          with duration and camera. You can edit every field after.
        </p>
        {project.scenes.length > 0 && (
          <ol className="flex flex-col gap-3">
            {project.scenes.map((s) => (
              <li key={s.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <Badge>Scene {String(s.index).padStart(2, "0")}</Badge>
                  <span className="font-mono text-xs text-subtle tabular-nums">
                    {s.duration}s
                  </span>
                </div>
                <p className="mt-2 text-sm text-fg">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {s.action}
                </p>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
