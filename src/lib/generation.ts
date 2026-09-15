import { createServerFn } from "@tanstack/react-start";
import { BREAKDOWN_SYSTEM, characterImagePrompt, sceneFramePrompt, sceneMotionPrompt } from "./prompts";
import type { AspectRatio, BreakdownResult, Character, Scene } from "./types";
import { uid } from "./utils";
import { modelNeedsHf } from "./models";

function parseBreakdown(raw: string): BreakdownResult {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model did not return JSON");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as BreakdownResult;
  if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
    throw new Error("Breakdown had no scenes");
  }
  parsed.scenes = parsed.scenes.slice(0, 6).map((s) => ({
    ...s,
    duration: Math.min(8, Math.max(4, Number(s.duration) || 5)),
    dialogue: s.dialogue ?? "",
    camera: s.camera ?? "Locked mid-shot",
    characters: s.characters ?? [],
  }));
  parsed.characters = (parsed.characters ?? []).slice(0, 6);
  return parsed;
}

export const getProviderStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const { xaiKey } = await import("./xai.server");
    return { xai: Boolean(xaiKey()) };
  },
);

export const breakdownScript = createServerFn({ method: "POST" })
  .validator(
    (input: {
      script: string;
      model: string;
      hfToken?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const script = data.script.trim();
    if (script.length < 20) return { ok: false as const, error: "Script is too short." };
    try {
      const { xaiChat } = await import("./xai.server");
      const { hfChat } = await import("./hf.server");
      const text = modelNeedsHf("script", data.model)
        ? await hfChat(data.hfToken ?? "", data.model, BREAKDOWN_SYSTEM, script)
        : await xaiChat(script, BREAKDOWN_SYSTEM);
      const parsed = parseBreakdown(text);
      const characters: Character[] = parsed.characters.map((c) => ({
        id: uid("char"),
        name: c.name,
        description: c.description,
        wardrobe: c.wardrobe,
      }));
      const nameToId = new Map(characters.map((c) => [c.name.toLowerCase(), c.id]));
      const scenes: Scene[] = parsed.scenes.map((s, i) => ({
        id: uid("scene"),
        index: i + 1,
        title: s.title,
        location: s.location,
        action: s.action,
        dialogue: s.dialogue,
        camera: s.camera,
        duration: s.duration,
        characterIds: (s.characters ?? [])
          .map((n) => nameToId.get(n.toLowerCase()))
          .filter((x): x is string => Boolean(x)),
        videoStatus: "idle" as const,
        trimIn: 0,
        trimOut: s.duration,
        included: true,
      }));
      return {
        ok: true as const,
        title: parsed.title || "Untitled reel",
        logline: parsed.logline || "",
        style: parsed.style || "",
        characters,
        scenes,
      };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Breakdown failed",
      };
    }
  });

export const generateStill = createServerFn({ method: "POST" })
  .validator(
    (input: {
      kind: "character" | "frame";
      model: string;
      hfToken?: string;
      aspect: AspectRatio;
      character?: Character;
      scene?: Scene;
      characters?: Character[];
      style: string;
      refs?: string[];
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const prompt =
        data.kind === "character" && data.character
          ? characterImagePrompt(data.character, data.style, data.aspect === "9:16" ? "3:4" : "2:3")
          : data.scene
            ? sceneFramePrompt(
                data.scene,
                data.characters ?? [],
                data.style,
                data.aspect,
              )
            : "";
      if (!prompt) return { ok: false as const, error: "Nothing to generate." };

      const { xaiImage, materializeUrl } = await import("./xai.server");
      const { hfTextToImage } = await import("./hf.server");

      let url: string;
      if (modelNeedsHf(data.kind === "character" ? "character" : "frame", data.model)) {
        if (!data.hfToken)
          return { ok: false as const, error: "Add a Hugging Face token in settings." };
        url = await hfTextToImage(data.hfToken, data.model, prompt, data.aspect);
      } else {
        url = await xaiImage({
          prompt,
          aspect: data.kind === "character" ? "2:3" : data.aspect,
          refs: data.refs,
        });
        url = await materializeUrl(url);
      }
      return { ok: true as const, url, prompt };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Image generation failed",
      };
    }
  });

export const startClip = createServerFn({ method: "POST" })
  .validator(
    (input: {
      model: string;
      hfToken?: string;
      scene: Scene;
      characters: Character[];
      style: string;
      aspect: AspectRatio;
      resolution: "480p" | "720p";
    }) => input,
  )
  .handler(async ({ data }) => {
    try {
      const prompt = sceneMotionPrompt(data.scene, data.characters, data.style);
      const refs = data.characters
        .map((c) => c.imageUrl)
        .filter((u): u is string => Boolean(u));
      const { xaiStartVideo } = await import("./xai.server");
      const { hfStartVideo } = await import("./hf.server");
      if (modelNeedsHf("video", data.model)) {
        if (!data.hfToken)
          return { ok: false as const, error: "Add a Hugging Face token in settings." };
        const started = await hfStartVideo(
          data.hfToken,
          data.model,
          prompt,
          data.scene.frameUrl,
        );
        if (started.url) {
          return {
            ok: true as const,
            immediate: true as const,
            url: started.url,
            prompt,
          };
        }
        return {
          ok: true as const,
          immediate: false as const,
          requestId: started.requestId ?? "",
          prompt,
        };
      }
      const requestId = await xaiStartVideo({
        prompt,
        imageUrl: data.scene.frameUrl,
        refs,
        duration: data.scene.duration,
        aspect: data.aspect,
        resolution: data.resolution,
      });
      return { ok: true as const, immediate: false as const, requestId, prompt };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Video start failed",
      };
    }
  });

export const pollClip = createServerFn({ method: "POST" })
  .validator((input: { requestId: string; model: string }) => input)
  .handler(async ({ data }) => {
    try {
      if (modelNeedsHf("video", data.model)) {
        return {
          ok: true as const,
          status: "failed" as const,
          error: "This provider does not expose a poll handle. Retry generation.",
        };
      }
      const { xaiPollVideo } = await import("./xai.server");
      const result = await xaiPollVideo(data.requestId);
      return { ok: true as const, ...result };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Poll failed",
      };
    }
  });
