import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModelPicker } from "./model-picker";
import { generateStill } from "@/lib/generation";
import { getHfToken, useStudio } from "@/lib/store";
import { modelNeedsHf, resolveModelId } from "@/lib/models";
import type { Character } from "@/lib/types";

export function CastStep() {
  const project = useStudio((s) => s.project);
  const add = useStudio((s) => s.addCharacter);
  const busy = useStudio((s) => Boolean(s.busy.cast));

  async function generateAll() {
    const { setBusy, updateCharacter } = useStudio.getState();
    const model = resolveModelId(
      project.models.character,
      project.customModels.character,
    );
    if (modelNeedsHf("character", model) && !getHfToken()) {
      toast.error("This model needs a Hugging Face token in settings.");
      return;
    }
    setBusy("cast", true);
    try {
      for (const c of useStudio.getState().project.characters) {
        const res = await generateStill({
          data: {
            kind: "character",
            model,
            hfToken: getHfToken() || undefined,
            aspect: project.aspect,
            character: c,
            style: project.style,
          },
        });
        if (!res.ok) {
          toast.error(`${c.name}: ${res.error}`);
          continue;
        }
        updateCharacter(c.id, { imageUrl: res.url, imagePrompt: res.prompt });
      }
    } finally {
      setBusy("cast", false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
            Take 02
          </p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">Cast</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64 max-w-full">
            <ModelPicker task="character" label="Character sheet model" />
          </div>
          <Button variant="outline" onClick={add}>
            <Plus /> Add
          </Button>
          <Button disabled={busy || project.characters.length === 0} onClick={() => void generateAll()}>
            {busy ? "Exposing sheets…" : "Generate all sheets"}
          </Button>
        </div>
      </div>
      {project.characters.length === 0 ? (
        <Empty hint="Break the script first, or add a character by hand." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {project.characters.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ hint }: { hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted">
      {hint}
    </div>
  );
}

function CharacterCard({ character }: { character: Character }) {
  const update = useStudio((s) => s.updateCharacter);
  const remove = useStudio((s) => s.removeCharacter);
  const project = useStudio((s) => s.project);
  const busy = useStudio((s) => Boolean(s.busy[`char:${character.id}`]));
  const setBusy = useStudio((s) => s.setBusy);

  async function generateOne() {
    const model = resolveModelId(
      project.models.character,
      project.customModels.character,
    );
    if (modelNeedsHf("character", model) && !getHfToken()) {
      toast.error("This model needs a Hugging Face token in settings.");
      return;
    }
    setBusy(`char:${character.id}`, true);
    try {
      const res = await generateStill({
        data: {
          kind: "character",
          model,
          hfToken: getHfToken() || undefined,
          aspect: project.aspect,
          character,
          style: project.style,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      update(character.id, { imageUrl: res.url, imagePrompt: res.prompt });
    } finally {
      setBusy(`char:${character.id}`, false);
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string")
        update(character.id, { imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <article className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[140px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-md bg-raised">
        {character.imageUrl ? (
          <img
            src={character.imageUrl}
            alt={character.name}
            className="aspect-[2/3] h-full w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center text-xs text-subtle">
            No sheet
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Label>Name</Label>
            <Input
              value={character.name}
              onChange={(e) => update(character.id, { name: e.target.value })}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove character"
            onClick={() => remove(character.id)}
          >
            <Trash2 />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Appearance</Label>
          <Textarea
            className="min-h-20"
            value={character.description}
            onChange={(e) =>
              update(character.id, { description: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Wardrobe</Label>
          <Input
            value={character.wardrobe}
            onChange={(e) => update(character.id, { wardrobe: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={busy} onClick={() => void generateOne()}>
            {busy ? "Exposing…" : "Generate sheet"}
          </Button>
          <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-3 text-xs">
            Upload still
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>
    </article>
  );
}
