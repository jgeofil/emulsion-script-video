import { t as ASPECT_PIXELS } from "./models-B2CYspfs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hf.server-BvwYkhkl.js
var ROUTER = "https://router.huggingface.co";
function hfHeaders(token, extra) {
	return {
		Authorization: `Bearer ${token}`,
		...extra
	};
}
async function hfChat(token, model, system, prompt) {
	const res = await fetch(`${ROUTER}/v1/chat/completions`, {
		method: "POST",
		headers: hfHeaders(token, { "Content-Type": "application/json" }),
		body: JSON.stringify({
			model,
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
		throw new Error(`Hugging Face chat error ${res.status}: ${t.slice(0, 280)}`);
	}
	return (await res.json()).choices?.[0]?.message?.content ?? "";
}
async function hfTextToImage(token, model, prompt, aspect) {
	const { w, h } = ASPECT_PIXELS[aspect];
	const attempts = [() => fetch(`${ROUTER}/hf-inference/models/${model}`, {
		method: "POST",
		headers: hfHeaders(token, { "Content-Type": "application/json" }),
		body: JSON.stringify({
			inputs: prompt,
			parameters: {
				width: w,
				height: h
			}
		})
	}), () => fetch(`${ROUTER}/v1/images/generations`, {
		method: "POST",
		headers: hfHeaders(token, { "Content-Type": "application/json" }),
		body: JSON.stringify({
			model,
			prompt,
			size: `${w}x${h}`,
			response_format: "b64_json"
		})
	})];
	let last = "";
	for (const run of attempts) {
		const res = await run();
		if (!res.ok) {
			last = await res.text();
			continue;
		}
		const ctype = res.headers.get("content-type") || "";
		if (ctype.startsWith("image/")) return `data:${ctype};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
		const json = await res.json();
		if (json.data?.[0]?.b64_json) return `data:image/png;base64,${json.data[0].b64_json}`;
		if (json.data?.[0]?.url) return json.data[0].url;
		if (json.url) return json.url;
	}
	throw new Error(last ? `Hugging Face image error: ${last.slice(0, 280)}` : "Hugging Face image model returned no image");
}
async function hfStartVideo(token, model, prompt, imageUrl) {
	const payload = { inputs: prompt };
	if (imageUrl) payload.image = imageUrl;
	const endpoints = [
		`${ROUTER}/hf-inference/models/${model}`,
		`${ROUTER}/fal-ai/${model}`,
		`${ROUTER}/replicate/${model}`
	];
	let last = "";
	for (const url of endpoints) {
		const res = await fetch(url, {
			method: "POST",
			headers: hfHeaders(token, { "Content-Type": "application/json" }),
			body: JSON.stringify(payload)
		});
		if (!res.ok) {
			last = await res.text();
			continue;
		}
		const ctype = res.headers.get("content-type") || "";
		if (ctype.startsWith("video/") || ctype.includes("octet-stream")) {
			const buf = Buffer.from(await res.arrayBuffer());
			return { url: `data:${ctype.split(";")[0]};base64,${buf.toString("base64")}` };
		}
		const json = await res.json();
		if (json.video?.url) return { url: json.video.url };
		if (json.url) return { url: json.url };
		if (json.request_id || json.id) return { requestId: json.request_id ?? json.id };
	}
	throw new Error(last ? `Hugging Face video error: ${last.slice(0, 280)}` : "This video model is not available via Inference Providers for this token.");
}
//#endregion
export { hfChat, hfStartVideo, hfTextToImage };
