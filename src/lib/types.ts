export type PipelineStep = "script" | "cast" | "frames" | "motion" | "cut";

export type AspectRatio = "16:9" | "9:16" | "1:1";

export type VideoStatus = "idle" | "queued" | "running" | "done" | "error";

export type TransitionKind = "cut" | "crossfade";

export interface Character {
  id: string;
  name: string;
  description: string;
  wardrobe: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface Scene {
  id: string;
  index: number;
  title: string;
  location: string;
  action: string;
  dialogue: string;
  camera: string;
  duration: number;
  characterIds: string[];
  frameUrl?: string;
  framePrompt?: string;
  videoUrl?: string;
  videoPrompt?: string;
  videoStatus: VideoStatus;
  videoRequestId?: string;
  videoError?: string;
  trimIn: number;
  trimOut: number;
  included: boolean;
}

export interface ProjectModels {
  script: string;
  character: string;
  frame: string;
  video: string;
}

export interface Project {
  title: string;
  logline: string;
  script: string;
  style: string;
  aspect: AspectRatio;
  resolution: "480p" | "720p";
  transition: TransitionKind;
  characters: Character[];
  scenes: Scene[];
  models: ProjectModels;
  customModels: ProjectModels;
  finalUrl?: string;
}

export interface BreakdownResult {
  title: string;
  logline: string;
  style: string;
  characters: Array<{
    name: string;
    description: string;
    wardrobe: string;
  }>;
  scenes: Array<{
    title: string;
    location: string;
    action: string;
    dialogue: string;
    camera: string;
    duration: number;
    characters: string[];
  }>;
}

export interface GenerateResult {
  ok: true;
  url: string;
  prompt: string;
}

export interface GenerateError {
  ok: false;
  error: string;
}

export type GenResponse = GenerateResult | GenerateError;

export interface VideoStartResult {
  ok: true;
  requestId: string;
  prompt: string;
}

export interface VideoPollResult {
  ok: true;
  status: "running" | "done" | "failed";
  url?: string;
  error?: string;
}
