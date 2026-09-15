import { cn } from "@/lib/utils";
import { useStudio } from "@/lib/store";
import type { PipelineStep } from "@/lib/types";

const STEPS: { id: PipelineStep; n: string; label: string }[] = [
  { id: "script", n: "01", label: "Script" },
  { id: "cast", n: "02", label: "Cast" },
  { id: "frames", n: "03", label: "Frames" },
  { id: "motion", n: "04", label: "Motion" },
  { id: "cut", n: "05", label: "Cut" },
];

export function StepRail() {
  const step = useStudio((s) => s.step);
  const setStep = useStudio((s) => s.setStep);
  const scenes = useStudio((s) => s.project.scenes.length);
  const chars = useStudio((s) => s.project.characters.length);

  return (
    <nav
      aria-label="Production steps"
      className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:px-6"
    >
      {STEPS.map((s) => {
        const active = s.id === step;
        const done =
          (s.id === "script" && scenes > 0) ||
          (s.id === "cast" && chars > 0) ||
          (s.id === "frames" &&
            useStudio.getState().project.scenes.some((x) => x.frameUrl)) ||
          (s.id === "motion" &&
            useStudio.getState().project.scenes.some((x) => x.videoUrl));
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150",
              active ? "bg-raised text-fg" : "text-muted hover:text-fg",
            )}
          >
            <span className="font-mono text-[10px] tracking-[0.18em] text-subtle">
              {s.n}
            </span>
            {s.label}
            {done && !active && (
              <span className="size-1.5 rounded-full bg-ok" aria-hidden />
            )}
          </button>
        );
      })}
    </nav>
  );
}
