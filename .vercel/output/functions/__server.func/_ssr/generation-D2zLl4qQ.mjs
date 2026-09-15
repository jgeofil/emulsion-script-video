import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as characterImagePrompt, c as sceneFramePrompt, l as sceneMotionPrompt, n as BREAKDOWN_SYSTEM, o as modelNeedsHf } from "./models-B2CYspfs.mjs";
import { r as uid } from "./utils-DTRwhPEg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generation-D2zLl4qQ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parseBreakdown(raw) {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("Model did not return JSON");
	const parsed = JSON.parse(raw.slice(start, end + 1));
	if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) throw new Error("Breakdown had no scenes");
	parsed.scenes = parsed.scenes.slice(0, 6).map((s) => ({
		...s,
		duration: Math.min(8, Math.max(4, Number(s.duration) || 5)),
		dialogue: s.dialogue ?? "",
		camera: s.camera ?? "Locked mid-shot",
		characters: s.characters ?? []
	}));
	parsed.characters = (parsed.characters ?? []).slice(0, 6);
	return parsed;
}
var getProviderStatus_createServerFn_handler = createServerRpc({
	id: "32584b9a8f8df89b83e7a5ea049ab67638f82594434ef71b790581539631a68e",
	name: "getProviderStatus",
	filename: "src/lib/generation.ts"
}, (opts) => getProviderStatus.__executeServer(opts));
var getProviderStatus = createServerFn({ method: "GET" }).handler(getProviderStatus_createServerFn_handler, async () => {
	const { xaiKey } = await import("./xai.server-BdRumqjJ.mjs");
	return { xai: Boolean(xaiKey()) };
});
var breakdownScript_createServerFn_handler = createServerRpc({
	id: "aed8b0bbab8ed351745dce7368a51a7936417da57b4f90f60b199adbf66b3c20",
	name: "breakdownScript",
	filename: "src/lib/generation.ts"
}, (opts) => breakdownScript.__executeServer(opts));
var breakdownScript = createServerFn({ method: "POST" }).validator((input) => input).handler(breakdownScript_createServerFn_handler, async ({ data }) => {
	const script = data.script.trim();
	if (script.length < 20) return {
		ok: false,
		error: "Script is too short."
	};
	try {
		const { xaiChat } = await import("./xai.server-BdRumqjJ.mjs");
		const { hfChat } = await import("./hf.server-BvwYkhkl.mjs");
		const parsed = parseBreakdown(modelNeedsHf("script", data.model) ? await hfChat(data.hfToken ?? "", data.model, BREAKDOWN_SYSTEM, script) : await xaiChat(script, BREAKDOWN_SYSTEM));
		const characters = parsed.characters.map((c) => ({
			id: uid("char"),
			name: c.name,
			description: c.description,
			wardrobe: c.wardrobe
		}));
		const nameToId = new Map(characters.map((c) => [c.name.toLowerCase(), c.id]));
		const scenes = parsed.scenes.map((s, i) => ({
			id: uid("scene"),
			index: i + 1,
			title: s.title,
			location: s.location,
			action: s.action,
			dialogue: s.dialogue,
			camera: s.camera,
			duration: s.duration,
			characterIds: (s.characters ?? []).map((n) => nameToId.get(n.toLowerCase())).filter((x) => Boolean(x)),
			videoStatus: "idle",
			trimIn: 0,
			trimOut: s.duration,
			included: true
		}));
		return {
			ok: true,
			title: parsed.title || "Untitled reel",
			logline: parsed.logline || "",
			style: parsed.style || "",
			characters,
			scenes
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Breakdown failed"
		};
	}
});
var generateStill_createServerFn_handler = createServerRpc({
	id: "6aeeca4cdad6fdd4a1e5bd02f2aad098e72ceec6e5146dadf66454beef21abe1",
	name: "generateStill",
	filename: "src/lib/generation.ts"
}, (opts) => generateStill.__executeServer(opts));
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(generateStill_createServerFn_handler, async ({ data }) => {
	try {
		const prompt = data.kind === "character" && data.character ? characterImagePrompt(data.character, data.style, data.aspect === "9:16" ? "3:4" : "2:3") : data.scene ? sceneFramePrompt(data.scene, data.characters ?? [], data.style, data.aspect) : "";
		if (!prompt) return {
			ok: false,
			error: "Nothing to generate."
		};
		const { xaiImage, materializeUrl } = await import("./xai.server-BdRumqjJ.mjs");
		const { hfTextToImage } = await import("./hf.server-BvwYkhkl.mjs");
		let url;
		if (modelNeedsHf(data.kind === "character" ? "character" : "frame", data.model)) {
			if (!data.hfToken) return {
				ok: false,
				error: "Add a Hugging Face token in settings."
			};
			url = await hfTextToImage(data.hfToken, data.model, prompt, data.aspect);
		} else {
			url = await xaiImage({
				prompt,
				aspect: data.kind === "character" ? "2:3" : data.aspect,
				refs: data.refs
			});
			url = await materializeUrl(url);
		}
		return {
			ok: true,
			url,
			prompt
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Image generation failed"
		};
	}
});
var startClip_createServerFn_handler = createServerRpc({
	id: "ea9232855fd68a0ef7c5dcc9355d6cd942ece5e9366afa07e439f9fc455c6415",
	name: "startClip",
	filename: "src/lib/generation.ts"
}, (opts) => startClip.__executeServer(opts));
var startClip = createServerFn({ method: "POST" }).validator((input) => input).handler(startClip_createServerFn_handler, async ({ data }) => {
	try {
		const prompt = sceneMotionPrompt(data.scene, data.characters, data.style);
		const refs = data.characters.map((c) => c.imageUrl).filter((u) => Boolean(u));
		const { xaiStartVideo } = await import("./xai.server-BdRumqjJ.mjs");
		const { hfStartVideo } = await import("./hf.server-BvwYkhkl.mjs");
		if (modelNeedsHf("video", data.model)) {
			if (!data.hfToken) return {
				ok: false,
				error: "Add a Hugging Face token in settings."
			};
			const started = await hfStartVideo(data.hfToken, data.model, prompt, data.scene.frameUrl);
			if (started.url) return {
				ok: true,
				immediate: true,
				url: started.url,
				prompt
			};
			return {
				ok: true,
				immediate: false,
				requestId: started.requestId ?? "",
				prompt
			};
		}
		return {
			ok: true,
			immediate: false,
			requestId: await xaiStartVideo({
				prompt,
				imageUrl: data.scene.frameUrl,
				refs,
				duration: data.scene.duration,
				aspect: data.aspect,
				resolution: data.resolution
			}),
			prompt
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Video start failed"
		};
	}
});
var pollClip_createServerFn_handler = createServerRpc({
	id: "d69d1e8334b3515d4a6c8d848e7e083c9689f92d351541f122117c51f1174e96",
	name: "pollClip",
	filename: "src/lib/generation.ts"
}, (opts) => pollClip.__executeServer(opts));
var pollClip = createServerFn({ method: "POST" }).validator((input) => input).handler(pollClip_createServerFn_handler, async ({ data }) => {
	try {
		if (modelNeedsHf("video", data.model)) return {
			ok: true,
			status: "failed",
			error: "This provider does not expose a poll handle. Retry generation."
		};
		const { xaiPollVideo } = await import("./xai.server-BdRumqjJ.mjs");
		return {
			ok: true,
			...await xaiPollVideo(data.requestId)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Poll failed"
		};
	}
});
//#endregion
export { breakdownScript_createServerFn_handler, generateStill_createServerFn_handler, getProviderStatus_createServerFn_handler, pollClip_createServerFn_handler, startClip_createServerFn_handler };
