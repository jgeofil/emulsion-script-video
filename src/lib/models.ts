export type ModelTask = "script" | "character" | "frame" | "video";
export type ModelProvider = "xai" | "huggingface";

export interface ModelOption {
  id: string;
  label: string;
  provider: ModelProvider;
  hint: string;
  needsHf?: boolean;
}

export const SCRIPT_MODELS: ModelOption[] = [
  {
    id: "grok-4.5",
    label: "Grok 4.5",
    provider: "xai",
    hint: "Breaks the script into scenes and a style bible",
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    label: "Qwen 2.5 72B",
    provider: "huggingface",
    hint: "Hugging Face Inference Providers",
    needsHf: true,
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    label: "Llama 3.3 70B",
    provider: "huggingface",
    hint: "Hugging Face Inference Providers",
    needsHf: true,
  },
  {
    id: "mistralai/Mistral-Small-24B-Instruct-2501",
    label: "Mistral Small 24B",
    provider: "huggingface",
    hint: "Hugging Face Inference Providers",
    needsHf: true,
  },
  {
    id: "google/gemma-3-27b-it",
    label: "Gemma 3 27B",
    provider: "huggingface",
    hint: "Hugging Face Inference Providers",
    needsHf: true,
  },
];

export const IMAGE_MODELS: ModelOption[] = [
  {
    id: "grok-imagine-image-2.0",
    label: "Grok Imagine Image 2.0",
    provider: "xai",
    hint: "Character sheets and scene stills, with references",
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    label: "FLUX.1 Schnell",
    provider: "huggingface",
    hint: "Fast open image model",
    needsHf: true,
  },
  {
    id: "black-forest-labs/FLUX.1-dev",
    label: "FLUX.1 Dev",
    provider: "huggingface",
    hint: "Higher-fidelity FLUX",
    needsHf: true,
  },
  {
    id: "Qwen/Qwen-Image",
    label: "Qwen Image",
    provider: "huggingface",
    hint: "Strong prompt following",
    needsHf: true,
  },
  {
    id: "stabilityai/stable-diffusion-3.5-large",
    label: "Stable Diffusion 3.5 Large",
    provider: "huggingface",
    hint: "Photoreal stills",
    needsHf: true,
  },
  {
    id: "ByteDance/SDXL-Lightning",
    label: "SDXL Lightning",
    provider: "huggingface",
    hint: "Fast SDXL distill",
    needsHf: true,
  },
];

export const VIDEO_MODELS: ModelOption[] = [
  {
    id: "grok-imagine-video-1.5",
    label: "Grok Imagine Video 1.5",
    provider: "xai",
    hint: "Image-to-video with character references",
  },
  {
    id: "Lightricks/LTX-2.5",
    label: "LTX 2.5",
    provider: "huggingface",
    hint: "Open image-to-video",
    needsHf: true,
  },
  {
    id: "Wan-AI/Wan2.2-I2V-A14B",
    label: "Wan 2.2 I2V",
    provider: "huggingface",
    hint: "Alibaba Wan image-to-video",
    needsHf: true,
  },
  {
    id: "Wan-AI/Wan2.1-I2V-14B-480P",
    label: "Wan 2.1 I2V 480p",
    provider: "huggingface",
    hint: "Lighter Wan image-to-video",
    needsHf: true,
  },
  {
    id: "Lightricks/LTX-Video",
    label: "LTX Video",
    provider: "huggingface",
    hint: "Realtime latent video",
    needsHf: true,
  },
  {
    id: "THUDM/CogVideoX-5b-I2V",
    label: "CogVideoX 5B I2V",
    provider: "huggingface",
    hint: "Image-conditioned CogVideoX",
    needsHf: true,
  },
];

export const MODEL_CATALOG: Record<ModelTask, ModelOption[]> = {
  script: SCRIPT_MODELS,
  character: IMAGE_MODELS,
  frame: IMAGE_MODELS,
  video: VIDEO_MODELS,
};

export const DEFAULT_MODELS = {
  script: "grok-4.5",
  character: "grok-imagine-image-2.0",
  frame: "grok-imagine-image-2.0",
  video: "grok-imagine-video-1.5",
} as const;

export function resolveModelId(preset: string, custom: string): string {
  const c = custom.trim();
  if (preset === "custom" && c) return c;
  if (c && !MODEL_CATALOG.script.concat(IMAGE_MODELS, VIDEO_MODELS).some((m) => m.id === preset)) {
    return c;
  }
  return preset;
}

export function lookupModel(task: ModelTask, id: string): ModelOption | undefined {
  return MODEL_CATALOG[task].find((m) => m.id === id);
}

export function modelNeedsHf(task: ModelTask, id: string): boolean {
  if (id.startsWith("grok-")) return false;
  const found = lookupModel(task, id);
  if (found) return Boolean(found.needsHf);
  return !id.startsWith("grok-");
}

export const ASPECT_PIXELS: Record<
  "16:9" | "9:16" | "1:1",
  { w: number; h: number }
> = {
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
  "1:1": { w: 1024, h: 1024 },
};
