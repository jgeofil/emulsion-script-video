import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { MODEL_CATALOG, type ModelTask } from "@/lib/models";
import { useStudio } from "@/lib/store";

const SLOT: Record<ModelTask, "script" | "character" | "frame" | "video"> = {
  script: "script",
  character: "character",
  frame: "frame",
  video: "video",
};

export function ModelPicker({
  task,
  label,
}: {
  task: ModelTask;
  label: string;
}) {
  const project = useStudio((s) => s.project);
  const setModel = useStudio((s) => s.setModel);
  const setCustom = useStudio((s) => s.setCustomModel);
  const slot = SLOT[task];
  const options = MODEL_CATALOG[task];
  const value = project.models[slot];
  const custom = project.customModels[slot];
  const known = options.some((o) => o.id === value);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={`model-${task}`}>{label}</Label>
      <SelectField
        id={`model-${task}`}
        value={known ? value : "custom"}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "custom") setModel(slot, custom || "custom");
          else setModel(slot, v);
        }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
            {o.needsHf ? " · HF" : ""}
          </option>
        ))}
        <option value="custom">Custom Hugging Face id</option>
      </SelectField>
      {(!known || value === "custom") && (
        <Input
          placeholder="org/model-name"
          value={custom}
          onChange={(e) => {
            setCustom(slot, e.target.value);
            setModel(slot, e.target.value || "custom");
          }}
        />
      )}
    </div>
  );
}
