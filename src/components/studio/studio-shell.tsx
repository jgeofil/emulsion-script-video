import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { StepRail } from "./step-rail";
import { SettingsButton } from "./settings-sheet";
import { ScriptStep } from "./script-step";
import { CastStep } from "./cast-step";
import { FramesStep } from "./frames-step";
import { MotionStep } from "./motion-step";
import { CutStep } from "./cut-step";
import { Button } from "@/components/ui/button";
import { getProviderStatus } from "@/lib/generation";
import { useStudio } from "@/lib/store";

export function StudioShell() {
  const step = useStudio((s) => s.step);
  const title = useStudio((s) => s.project.title);
  const loadSample = useStudio((s) => s.loadSample);
  const reset = useStudio((s) => s.reset);
  const setXai = useStudio((s) => s.setXaiAvailable);
  const refreshHf = useStudio((s) => s.refreshHf);

  useEffect(() => {
    void useStudio.persist.rehydrate();
    refreshHf();
    void getProviderStatus().then((s) => setXai(s.xai));
  }, [refreshHf, setXai]);

  return (
    <div className="film-grain flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <div className="min-w-0">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Emulsion
          </Link>
          <p className="truncate font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
            {title || "Untitled reel"} · script to screen
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={loadSample}>
            Sample reel
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            New
          </Button>
          <Link
            to="/space"
            className="hidden h-11 items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex"
          >
            Space
          </Link>
          <SettingsButton />
        </div>
      </header>
      <StepRail />
      <main className="flex-1">
        {step === "script" && <ScriptStep />}
        {step === "cast" && <CastStep />}
        {step === "frames" && <FramesStep />}
        {step === "motion" && <MotionStep />}
        {step === "cut" && <CutStep />}
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "bg-surface text-fg border border-border",
        }}
      />
    </div>
  );
}
