import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { getHfToken, setHfToken, useStudio } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const project = useStudio((s) => s.project);
  const patch = useStudio((s) => s.patchProject);
  const refreshHf = useStudio((s) => s.refreshHf);
  const xai = useStudio((s) => s.xaiAvailable);
  const hf = useStudio((s) => s.hfTokenPresent);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setToken(getHfToken());
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70" />
        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col gap-6 overflow-y-auto border-l border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-2xl">Lab settings</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Pick a Hugging Face model on any step. Grok models run here without a
            token. Open-weight models need a Hugging Face token with Inference
            Providers enabled.
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hf-token">Hugging Face token</Label>
            <Input
              id="hf-token"
              type="password"
              autoComplete="off"
              placeholder="hf_…"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                setHfToken(token.trim());
                refreshHf();
              }}
            >
              Save token on this device
            </Button>
            <p className="text-xs text-subtle">
              Stored in session storage only. Never sent except to Hugging Face
              with the request you start.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
                Grok
              </p>
              <p className="mt-2 text-sm">{xai ? "Ready" : "Unavailable"}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
                Hugging Face
              </p>
              <p className="mt-2 text-sm">{hf ? "Token set" : "No token"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="aspect">Frame</Label>
            <SelectField
              id="aspect"
              value={project.aspect}
              onChange={(e) =>
                patch({ aspect: e.target.value as typeof project.aspect })
              }
            >
              <option value="16:9">16:9 landscape</option>
              <option value="9:16">9:16 portrait</option>
              <option value="1:1">1:1 square</option>
            </SelectField>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="res">Motion resolution</Label>
            <SelectField
              id="res"
              value={project.resolution}
              onChange={(e) =>
                patch({
                  resolution: e.target.value as typeof project.resolution,
                })
              }
            >
              <option value="480p">480p — cheaper, faster</option>
              <option value="720p">720p</option>
            </SelectField>
          </div>
          <Link
            to="/space"
            className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => setOpen(false)}
          >
            Hugging Face Space source
          </Link>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
