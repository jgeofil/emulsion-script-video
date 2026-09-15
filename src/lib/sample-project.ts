import type { Project } from "./types";
import { DEFAULT_MODELS } from "./models";

export const SAMPLE_SCRIPT = `Title: Paper Birds

A quiet Kyoto workshop. Late afternoon light.

AIKO, a paper artist, folds a crane from white washi. Her hands are ink-stained. She finishes the last crease, sets the bird on the table, and watches.

The crane shivers. Paper wings catch the sun. It lifts off the wood, gold-ink edges flashing, and flies through the open window.

Dusk. Over dark tiled rooftops a white crane glides, lanterns warming the alleys below. It becomes a small bright mark against the indigo sky, and is gone.`;

export function createSampleProject(): Project {
  return {
    title: "Paper Birds",
    logline:
      "A Kyoto paper artist folds a crane that comes alive and flies the dusk rooftops.",
    script: SAMPLE_SCRIPT,
    style:
      "Cinematic 35mm stills, muted earth and indigo, warm tungsten practicals, fine film grain, magical realism, no text, photoreal paper texture.",
    aspect: "16:9",
    resolution: "480p",
    transition: "crossfade",
    models: { ...DEFAULT_MODELS },
    customModels: { script: "", character: "", frame: "", video: "" },
    characters: [
      {
        id: "char_aiko",
        name: "Aiko",
        description:
          "Japanese woman in her late twenties, short black bob, calm focused face, dark eyes, ink-stained fingertips.",
        wardrobe: "Indigo linen apron over a cream cotton shirt, sleeves rolled.",
        imageUrl: "/sample/aiko.jpg",
        imagePrompt: "Character sheet, Aiko, paper artist",
      },
      {
        id: "char_crane",
        name: "The Crane",
        description:
          "A white origami crane of washi paper, gold-ink edges on the wing folds, visible fiber texture.",
        wardrobe: "Folded white paper, gold-ink lining.",
        imageUrl: "/sample/crane.jpg",
        imagePrompt: "Macro still of the origami crane",
      },
    ],
    scenes: [
      {
        id: "scene_01",
        index: 1,
        title: "The last crease",
        location: "Traditional Japanese paper workshop, late afternoon",
        action:
          "Aiko sits at a long wooden table and finishes folding a white crane, hands precise in a shaft of sun.",
        dialogue: "",
        camera: "Slow push-in, mid-wide, warm tungsten and sunbeam",
        duration: 6,
        characterIds: ["char_aiko"],
        frameUrl: "/sample/scene-01.jpg",
        framePrompt: "Workshop folding scene",
        videoUrl: "/sample/scene-01.mp4",
        videoPrompt: "Slow push-in as she folds",
        videoStatus: "done",
        trimIn: 0,
        trimOut: 6,
        included: true,
      },
      {
        id: "scene_02",
        index: 2,
        title: "First flight",
        location: "The same workshop table",
        action:
          "The origami crane shivers, paper wings beat, and it lifts off the wood into a shaft of light.",
        dialogue: "",
        camera: "Close three-quarter, slight rise with the bird",
        duration: 6,
        characterIds: ["char_aiko", "char_crane"],
        frameUrl: "/sample/scene-02.jpg",
        framePrompt: "Crane lifting off the table",
        videoUrl: "/sample/scene-02.mp4",
        videoPrompt: "Wings beat, crane lifts off",
        videoStatus: "done",
        trimIn: 0,
        trimOut: 6,
        included: true,
      },
      {
        id: "scene_03",
        index: 3,
        title: "Over the roofs",
        location: "Kyoto tiled rooftops at dusk",
        action:
          "The white crane glides above dark roofs while paper lanterns glow in an alley below.",
        dialogue: "",
        camera: "Tracking wide, aerial-adjacent, indigo hour",
        duration: 6,
        characterIds: ["char_crane"],
        frameUrl: "/sample/scene-03.jpg",
        framePrompt: "Crane over dusk rooftops",
        videoUrl: "/sample/scene-03.mp4",
        videoPrompt: "Tracking glide over rooftops",
        videoStatus: "done",
        trimIn: 0,
        trimOut: 6,
        included: true,
      },
    ],
  };
}

export function emptyProject(): Project {
  return {
    title: "Untitled reel",
    logline: "",
    script: "",
    style: "",
    aspect: "16:9",
    resolution: "480p",
    transition: "cut",
    models: { ...DEFAULT_MODELS },
    customModels: { script: "", character: "", frame: "", video: "" },
    characters: [],
    scenes: [],
  };
}
