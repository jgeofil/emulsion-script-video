import type { Character, Scene } from "./types";

export const BREAKDOWN_SYSTEM = `You are a film director's assistant. Turn a screenplay or prose treatment into a tight production package.

Return ONLY valid JSON with this shape:
{
  "title": string,
  "logline": string,
  "style": string,
  "characters": [{"name": string, "description": string, "wardrobe": string}],
  "scenes": [{
    "title": string,
    "location": string,
    "action": string,
    "dialogue": string,
    "camera": string,
    "duration": number,
    "characters": string[]
  }]
}

Rules:
- 3 to 6 scenes. Never more than 6.
- duration is seconds, between 4 and 8.
- style is a visual bible used for every still and clip (lens, grain, palette, era). No camera brand names.
- character description is physical appearance only. wardrobe is clothing.
- scenes.characters lists character names that appear.
- camera is shot size + movement in one short phrase.
- Keep action concrete and visual. No commentary.`;

export function characterImagePrompt(
  character: Character,
  style: string,
  aspect: string,
): string {
  return [
    `Character reference sheet, single subject, ${aspect} frame.`,
    `${character.name}: ${character.description}`,
    `Wardrobe: ${character.wardrobe}`,
    "Neutral standing or seated pose, clear face, studio-adjacent practical light, not a collage, not a grid.",
    style,
    "Photoreal cinematic still, no text, no watermark, no logo.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function sceneFramePrompt(
  scene: Scene,
  characters: Character[],
  style: string,
  aspect: string,
): string {
  const cast =
    characters.length > 0
      ? `Cast in frame: ${characters
          .map((c) => `${c.name} (${c.description}; wearing ${c.wardrobe})`)
          .join(" | ")}`
      : "No principal cast, environment-led.";
  return [
    `Cinematic production still, ${aspect} widescreen frame, one locked composition.`,
    `Scene ${scene.index}: ${scene.title}. Location: ${scene.location}.`,
    `Action: ${scene.action}`,
    scene.dialogue ? `Spoken (do not render as on-screen text): ${scene.dialogue}` : "",
    `Camera: ${scene.camera}`,
    cast,
    style,
    "Photoreal 35mm still, no captions, no subtitles, no watermark.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function sceneMotionPrompt(
  scene: Scene,
  characters: Character[],
  style: string,
): string {
  const refs = characters
    .map((c, i) => `Keep ${c.name} consistent with reference <IMAGE_${i + 1}>.`)
    .join(" ");
  return [
    scene.camera,
    scene.action,
    refs,
    style,
    "Natural motion, continuous shot, no jump cuts, no on-screen text.",
  ]
    .filter(Boolean)
    .join(" ");
}
