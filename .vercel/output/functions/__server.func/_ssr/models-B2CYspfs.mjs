//#region node_modules/.nitro/vite/services/ssr/assets/models-B2CYspfs.js
var BREAKDOWN_SYSTEM = `You are a film director's assistant. Turn a screenplay or prose treatment into a tight production package.

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
function characterImagePrompt(character, style, aspect) {
	return [
		`Character reference sheet, single subject, ${aspect} frame.`,
		`${character.name}: ${character.description}`,
		`Wardrobe: ${character.wardrobe}`,
		"Neutral standing or seated pose, clear face, studio-adjacent practical light, not a collage, not a grid.",
		style,
		"Photoreal cinematic still, no text, no watermark, no logo."
	].filter(Boolean).join(" ");
}
function sceneFramePrompt(scene, characters, style, aspect) {
	const cast = characters.length > 0 ? `Cast in frame: ${characters.map((c) => `${c.name} (${c.description}; wearing ${c.wardrobe})`).join(" | ")}` : "No principal cast, environment-led.";
	return [
		`Cinematic production still, ${aspect} widescreen frame, one locked composition.`,
		`Scene ${scene.index}: ${scene.title}. Location: ${scene.location}.`,
		`Action: ${scene.action}`,
		scene.dialogue ? `Spoken (do not render as on-screen text): ${scene.dialogue}` : "",
		`Camera: ${scene.camera}`,
		cast,
		style,
		"Photoreal 35mm still, no captions, no subtitles, no watermark."
	].filter(Boolean).join(" ");
}
function sceneMotionPrompt(scene, characters, style) {
	const refs = characters.map((c, i) => `Keep ${c.name} consistent with reference <IMAGE_${i + 1}>.`).join(" ");
	return [
		scene.camera,
		scene.action,
		refs,
		style,
		"Natural motion, continuous shot, no jump cuts, no on-screen text."
	].filter(Boolean).join(" ");
}
var SCRIPT_MODELS = [
	{
		id: "grok-4.5",
		label: "Grok 4.5",
		provider: "xai",
		hint: "Breaks the script into scenes and a style bible"
	},
	{
		id: "Qwen/Qwen2.5-72B-Instruct",
		label: "Qwen 2.5 72B",
		provider: "huggingface",
		hint: "Hugging Face Inference Providers",
		needsHf: true
	},
	{
		id: "meta-llama/Llama-3.3-70B-Instruct",
		label: "Llama 3.3 70B",
		provider: "huggingface",
		hint: "Hugging Face Inference Providers",
		needsHf: true
	},
	{
		id: "mistralai/Mistral-Small-24B-Instruct-2501",
		label: "Mistral Small 24B",
		provider: "huggingface",
		hint: "Hugging Face Inference Providers",
		needsHf: true
	},
	{
		id: "google/gemma-3-27b-it",
		label: "Gemma 3 27B",
		provider: "huggingface",
		hint: "Hugging Face Inference Providers",
		needsHf: true
	}
];
var IMAGE_MODELS = [
	{
		id: "grok-imagine-image-2.0",
		label: "Grok Imagine Image 2.0",
		provider: "xai",
		hint: "Character sheets and scene stills, with references"
	},
	{
		id: "black-forest-labs/FLUX.1-schnell",
		label: "FLUX.1 Schnell",
		provider: "huggingface",
		hint: "Fast open image model",
		needsHf: true
	},
	{
		id: "black-forest-labs/FLUX.1-dev",
		label: "FLUX.1 Dev",
		provider: "huggingface",
		hint: "Higher-fidelity FLUX",
		needsHf: true
	},
	{
		id: "Qwen/Qwen-Image",
		label: "Qwen Image",
		provider: "huggingface",
		hint: "Strong prompt following",
		needsHf: true
	},
	{
		id: "stabilityai/stable-diffusion-3.5-large",
		label: "Stable Diffusion 3.5 Large",
		provider: "huggingface",
		hint: "Photoreal stills",
		needsHf: true
	},
	{
		id: "ByteDance/SDXL-Lightning",
		label: "SDXL Lightning",
		provider: "huggingface",
		hint: "Fast SDXL distill",
		needsHf: true
	}
];
var VIDEO_MODELS = [
	{
		id: "grok-imagine-video-1.5",
		label: "Grok Imagine Video 1.5",
		provider: "xai",
		hint: "Image-to-video with character references"
	},
	{
		id: "Lightricks/LTX-2.5",
		label: "LTX 2.5",
		provider: "huggingface",
		hint: "Open image-to-video",
		needsHf: true
	},
	{
		id: "Wan-AI/Wan2.2-I2V-A14B",
		label: "Wan 2.2 I2V",
		provider: "huggingface",
		hint: "Alibaba Wan image-to-video",
		needsHf: true
	},
	{
		id: "Wan-AI/Wan2.1-I2V-14B-480P",
		label: "Wan 2.1 I2V 480p",
		provider: "huggingface",
		hint: "Lighter Wan image-to-video",
		needsHf: true
	},
	{
		id: "Lightricks/LTX-Video",
		label: "LTX Video",
		provider: "huggingface",
		hint: "Realtime latent video",
		needsHf: true
	},
	{
		id: "THUDM/CogVideoX-5b-I2V",
		label: "CogVideoX 5B I2V",
		provider: "huggingface",
		hint: "Image-conditioned CogVideoX",
		needsHf: true
	}
];
var MODEL_CATALOG = {
	script: SCRIPT_MODELS,
	character: IMAGE_MODELS,
	frame: IMAGE_MODELS,
	video: VIDEO_MODELS
};
var DEFAULT_MODELS = {
	script: "grok-4.5",
	character: "grok-imagine-image-2.0",
	frame: "grok-imagine-image-2.0",
	video: "grok-imagine-video-1.5"
};
function resolveModelId(preset, custom) {
	const c = custom.trim();
	if (preset === "custom" && c) return c;
	if (c && !MODEL_CATALOG.script.concat(IMAGE_MODELS, VIDEO_MODELS).some((m) => m.id === preset)) return c;
	return preset;
}
function lookupModel(task, id) {
	return MODEL_CATALOG[task].find((m) => m.id === id);
}
function modelNeedsHf(task, id) {
	if (id.startsWith("grok-")) return false;
	const found = lookupModel(task, id);
	if (found) return Boolean(found.needsHf);
	return !id.startsWith("grok-");
}
var ASPECT_PIXELS = {
	"16:9": {
		w: 1280,
		h: 720
	},
	"9:16": {
		w: 720,
		h: 1280
	},
	"1:1": {
		w: 1024,
		h: 1024
	}
};
//#endregion
export { characterImagePrompt as a, sceneFramePrompt as c, MODEL_CATALOG as i, sceneMotionPrompt as l, BREAKDOWN_SYSTEM as n, modelNeedsHf as o, DEFAULT_MODELS as r, resolveModelId as s, ASPECT_PIXELS as t };
