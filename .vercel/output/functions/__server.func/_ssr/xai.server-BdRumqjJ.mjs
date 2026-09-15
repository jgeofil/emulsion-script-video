//#region node_modules/.nitro/vite/services/ssr/assets/xai.server-BdRumqjJ.js
var XAI = "https://api.x.ai/v1";
function xaiKey() {
	return process.env.XAI_API_KEY;
}
async function xaiFetch(path, init) {
	const key = xaiKey();
	if (!key) throw new Error("AI is not available in this environment");
	return await fetch(`${XAI}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json",
			...init.headers ?? {}
		}
	});
}
async function xaiChat(prompt, system) {
	const res = await xaiFetch("/chat/completions", {
		method: "POST",
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .35,
			max_tokens: 2400,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: prompt
			}]
		})
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Script model error ${res.status}: ${t.slice(0, 280)}`);
	}
	return (await res.json()).choices?.[0]?.message?.content ?? "";
}
async function xaiImage(opts) {
	const { prompt, aspect, refs } = opts;
	const usableRefs = (refs ?? []).filter((u) => Boolean(u)).slice(0, 5);
	if (usableRefs.length > 0) {
		const body = {
			model: "grok-imagine-image-2.0",
			prompt,
			image: {
				url: usableRefs[0],
				type: "image_url"
			}
		};
		if (usableRefs.length > 1) body.images = usableRefs.slice(1).map((url) => ({
			url,
			type: "image_url"
		}));
		const res = await xaiFetch("/images/edits", {
			method: "POST",
			body: JSON.stringify(body)
		});
		if (res.ok) return extractImageUrl(await res.json());
	}
	const res = await xaiFetch("/images/generations", {
		method: "POST",
		body: JSON.stringify({
			model: "grok-imagine-image-2.0",
			prompt,
			n: 1,
			aspect_ratio: aspect,
			resolution: "1k"
		})
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Image model error ${res.status}: ${t.slice(0, 280)}`);
	}
	return extractImageUrl(await res.json());
}
function extractImageUrl(json) {
	const j = json;
	const first = j.data?.[0];
	if (first?.url) return first.url;
	if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
	if (j.url) return j.url;
	throw new Error("Image model returned no url");
}
async function xaiStartVideo(opts) {
	const duration = Math.min(8, Math.max(4, Math.round(opts.duration)));
	const resolution = opts.resolution === "720p" ? "720p" : "480p";
	const body = {
		model: "grok-imagine-video-1.5",
		prompt: opts.prompt,
		duration,
		aspect_ratio: opts.aspect,
		resolution
	};
	if (opts.imageUrl) body.image = { url: opts.imageUrl };
	const refs = (opts.refs ?? []).filter((u) => u && u !== opts.imageUrl).slice(0, 7);
	if (refs.length) body.reference_images = refs.map((url) => ({ url }));
	let res = await xaiFetch("/videos/generations", {
		method: "POST",
		body: JSON.stringify(body)
	});
	if (!res.ok && refs.length) {
		const fallback = { ...body };
		delete fallback.reference_images;
		res = await xaiFetch("/videos/generations", {
			method: "POST",
			body: JSON.stringify(fallback)
		});
	}
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`Video model error ${res.status}: ${t.slice(0, 280)}`);
	}
	const json = await res.json();
	if (!json.request_id) throw new Error("Video model returned no request id");
	return json.request_id;
}
async function xaiPollVideo(requestId) {
	const res = await xaiFetch(`/videos/${encodeURIComponent(requestId)}`, { method: "GET" });
	if (!res.ok) return {
		status: "failed",
		error: (await res.text()).slice(0, 280)
	};
	const json = await res.json();
	const status = (json.status ?? "running").toLowerCase();
	if (status === "done" || status === "completed" || status === "succeeded") return {
		status: "done",
		url: json.video?.url
	};
	if (status === "failed" || status === "expired" || status === "error") return {
		status: "failed",
		error: json.error ?? "Video generation failed"
	};
	return { status: "running" };
}
async function materializeUrl(url) {
	if (url.startsWith("data:")) return url;
	if (url.startsWith("/")) return url;
	const res = await fetch(url);
	if (!res.ok) return url;
	const buf = Buffer.from(await res.arrayBuffer());
	if (buf.byteLength > 45e5) return url;
	const mime = res.headers.get("content-type") || "image/jpeg";
	if (!mime.startsWith("image/")) return url;
	return `data:${mime};base64,${buf.toString("base64")}`;
}
//#endregion
export { materializeUrl, xaiChat, xaiImage, xaiKey, xaiPollVideo, xaiStartVideo };
