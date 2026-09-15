import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyProject, createSampleProject } from "./sample-project";
import type { PipelineStep, Project, Character, Scene, ProjectModels } from "./types";
import { uid } from "./utils";

const HF_KEY = "emulsion.hf-token";

export function getHfToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(HF_KEY) ?? "";
}

export function setHfToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(HF_KEY, token);
  else sessionStorage.removeItem(HF_KEY);
}

type Busy = Partial<Record<string, boolean>>;

interface StudioState {
  step: PipelineStep;
  project: Project;
  busy: Busy;
  hfTokenPresent: boolean;
  xaiAvailable: boolean | null;
  setStep: (step: PipelineStep) => void;
  patchProject: (partial: Partial<Project>) => void;
  setModel: (slot: keyof ProjectModels, id: string) => void;
  setCustomModel: (slot: keyof ProjectModels, id: string) => void;
  loadSample: () => void;
  reset: () => void;
  setBusy: (key: string, value: boolean) => void;
  setXaiAvailable: (v: boolean) => void;
  refreshHf: () => void;
  addCharacter: () => void;
  updateCharacter: (id: string, patch: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  updateScene: (id: string, patch: Partial<Scene>) => void;
  moveScene: (id: string, dir: -1 | 1) => void;
  applyBreakdown: (project: Project) => void;
}

function stripHeavy(project: Project): Project {
  const strip = (url?: string) =>
    url && url.startsWith("data:") ? undefined : url;
  return {
    ...project,
    finalUrl: strip(project.finalUrl),
    characters: project.characters.map((c) => ({
      ...c,
      imageUrl: strip(c.imageUrl),
    })),
    scenes: project.scenes.map((s) => ({
      ...s,
      frameUrl: strip(s.frameUrl),
      videoUrl: strip(s.videoUrl),
    })),
  };
}

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      step: "script",
      project: emptyProject(),
      busy: {},
      hfTokenPresent: false,
      xaiAvailable: null,
      setStep: (step) => set({ step }),
      patchProject: (partial) =>
        set({ project: { ...get().project, ...partial } }),
      setModel: (slot, id) =>
        set({
          project: {
            ...get().project,
            models: { ...get().project.models, [slot]: id },
          },
        }),
      setCustomModel: (slot, id) =>
        set({
          project: {
            ...get().project,
            customModels: { ...get().project.customModels, [slot]: id },
          },
        }),
      loadSample: () => set({ project: createSampleProject(), step: "cut" }),
      reset: () => set({ project: emptyProject(), step: "script", busy: {} }),
      setBusy: (key, value) =>
        set({ busy: { ...get().busy, [key]: value } }),
      setXaiAvailable: (v) => set({ xaiAvailable: v }),
      refreshHf: () => set({ hfTokenPresent: Boolean(getHfToken()) }),
      addCharacter: () => {
        const c: Character = {
          id: uid("char"),
          name: "New character",
          description: "",
          wardrobe: "",
        };
        set({
          project: {
            ...get().project,
            characters: [...get().project.characters, c],
          },
        });
      },
      updateCharacter: (id, patch) =>
        set({
          project: {
            ...get().project,
            characters: get().project.characters.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        }),
      removeCharacter: (id) =>
        set({
          project: {
            ...get().project,
            characters: get().project.characters.filter((c) => c.id !== id),
            scenes: get().project.scenes.map((s) => ({
              ...s,
              characterIds: s.characterIds.filter((cid) => cid !== id),
            })),
          },
        }),
      updateScene: (id, patch) =>
        set({
          project: {
            ...get().project,
            scenes: get().project.scenes.map((s) =>
              s.id === id ? { ...s, ...patch } : s,
            ),
          },
        }),
      moveScene: (id, dir) => {
        const scenes = [...get().project.scenes];
        const i = scenes.findIndex((s) => s.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= scenes.length) return;
        const a = scenes[i];
        const b = scenes[j];
        if (!a || !b) return;
        scenes[i] = b;
        scenes[j] = a;
        set({
          project: {
            ...get().project,
            scenes: scenes.map((s, idx) => ({ ...s, index: idx + 1 })),
          },
        });
      },
      applyBreakdown: (project) => set({ project, step: "cast" }),
    }),
    {
      name: "emulsion.project",
      skipHydration: true,
      partialize: (s) => ({ step: s.step, project: stripHeavy(s.project) }),
    },
  ),
);
