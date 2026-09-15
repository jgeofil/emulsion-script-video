import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/select-field";
import { Progress } from "@/components/ui/progress";
import { useStudio } from "@/lib/store";
import { downloadBlob, mediaProxyUrl, stitchScenes } from "@/lib/stitch";
import { formatSeconds } from "@/lib/utils";
import type { TransitionKind } from "@/lib/types";

export function CutStep() {
  const project = useStudio((s) => s.project);
  const patch = useStudio((s) => s.patchProject);
  const update = useStudio((s) => s.updateScene);
  const move = useStudio((s) => s.moveScene);
  const [progress, setProgress] = useState(0);
  const [working, setWorking] = useState(false);

  const clips = project.scenes.filter((s) => s.videoUrl);
  const included = clips.filter((s) => s.included);

  async function stitch() {
    if (included.length === 0) {
      toast.error("Include at least one clip.");
      return;
    }
    setWorking(true);
    setProgress(0);
    try {
      const blob = await stitchScenes(
        project.scenes,
        { aspect: project.aspect, transition: project.transition },
        setProgress,
      );
      const url = URL.createObjectURL(blob);
      if (project.finalUrl?.startsWith("blob:")) URL.revokeObjectURL(project.finalUrl);
      patch({ finalUrl: url });
      toast.success("Final print is ready");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Stitch failed");
    } finally {
      setWorking(false);
    }
  }

  async function download() {
    if (!project.finalUrl) return;
    const res = await fetch(project.finalUrl);
    const blob = await res.blob();
    const slug = (project.title || "emulsion").toLowerCase().replace(/\s+/g, "-");
    downloadBlob(blob, `${slug}.webm`);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
            Take 05
          </p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">Cut</h2>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trans">Transition</Label>
            <SelectField
              id="trans"
              value={project.transition}
              onChange={(e) =>
                patch({ transition: e.target.value as TransitionKind })
              }
            >
              <option value="cut">Hard cut</option>
              <option value="crossfade">Crossfade</option>
            </SelectField>
          </div>
          <Button disabled={working || included.length === 0} onClick={() => void stitch()}>
            {working ? "Conforming…" : "Conform reel"}
          </Button>
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
          Roll motion clips before cutting. Or load the sample reel from the header.
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ol className="flex flex-col gap-3">
            {project.scenes.map((s, i) => (
              <li
                key={s.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      disabled={i === 0}
                      aria-label="Move up"
                      onClick={() => move(s.id, -1)}
                    >
                      <ChevronUp />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      disabled={i === project.scenes.length - 1}
                      aria-label="Move down"
                      onClick={() => move(s.id, 1)}
                    >
                      <ChevronDown />
                    </Button>
                  </div>
                  <div className="w-28 shrink-0 overflow-hidden rounded-sm bg-raised">
                    {s.videoUrl ? (
                      <video
                        src={mediaProxyUrl(s.videoUrl)}
                        poster={s.frameUrl}
                        muted
                        playsInline
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-[10px] text-subtle">
                        Empty
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge>SC {String(s.index).padStart(2, "0")}</Badge>
                        <h3 className="truncate text-sm">{s.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`inc-${s.id}`} className="normal-case tracking-normal">
                          Include
                        </Label>
                        <Switch
                          id={`inc-${s.id}`}
                          checked={s.included}
                          onCheckedChange={(v) => update(s.id, { included: v })}
                          disabled={!s.videoUrl}
                        />
                      </div>
                    </div>
                    {s.videoUrl && (
                      <div className="mt-3">
                        <p className="mb-1 font-mono text-[10px] text-subtle tabular-nums">
                          {formatSeconds(s.trimIn)} — {formatSeconds(s.trimOut)}
                        </p>
                        <Slider
                          min={0}
                          max={s.duration}
                          step={0.1}
                          value={[s.trimIn, s.trimOut]}
                          onValueChange={([a, b]) =>
                            update(s.id, {
                              trimIn: Math.min(a, b),
                              trimOut: Math.max(a, b),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <aside className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-border bg-raised">
              {project.finalUrl ? (
                <video
                  src={project.finalUrl}
                  controls
                  playsInline
                  className="aspect-video w-full bg-bg"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-muted">
                  Conform the reel to preview the joined print.
                </div>
              )}
            </div>
            {working && <Progress value={progress * 100} />}
            <Button
              variant="outline"
              disabled={!project.finalUrl}
              onClick={() => void download()}
            >
              Download reel
            </Button>
            <p className="text-xs leading-relaxed text-subtle">
              Trims and transitions are applied in the browser. The download is a
              WebM print of the timeline.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
