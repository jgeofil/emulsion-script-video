const XAI = "https://api.x.ai/v1";

export function xaiKey(): string | undefined {
  return process.env.XAI_API_KEY;
}

async function xaiFetch(path: string, init: RequestInit): Promise<Response> {
  const key = xaiKey();
  if (!key) throw new Error("AI is not available in this environment");
  const res = await fetch(`${XAI}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  return res;
}

export async function xaiChat(prompt: string, system: string): Promise<string> {
  const res = await xaiFetch("/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.35,
      max_tokens: 2400,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Script model error ${res.status}: ${t.slice(0, 280)}`);
  }
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return body.choices?.[0]?.message?.content ?? "";
}

export async function xaiImage(opts: {
  prompt: string;
  aspect: string;
  refs?: string[];
}): Promise<string> {
  const { prompt, aspect, refs } = opts;
  const usableRefs = (refs ?? []).filter((u) => Boolean(u)).slice(0, 5);

  if (usableRefs.length > 0) {
    const body: Record<string, unknown> = {
      model: "grok-imagine-image-2.0",
      prompt,
      image: { url: usableRefs[0], type: "image_url" },
    };
    if (usableRefs.length > 1) {
      body.images = usableRefs.slice(1).map((url) => ({ url, type: "image_url" }));
    }
    const res = await xaiFetch("/images/edits", {
      method: "POST",
      body: JSON.stringify(body),
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
      resolution: "1k",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Image model error ${res.status}: ${t.slice(0, 280)}`);
  }
  return extractImageUrl(await res.json());
}

function extractImageUrl(json: unknown): string {
  const j = json as {
    data?: { url?: string; b64_json?: string }[];
    url?: string;
  };
  const first = j.data?.[0];
  if (first?.url) return first.url;
  if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
  if (j.url) return j.url;
  throw new Error("Image model returned no url");
}

export async function xaiStartVideo(opts: {
  prompt: string;
  imageUrl?: string;
  refs?: string[];
  duration: number;
  aspect: string;
  resolution: "480p" | "720p";
}): Promise<string> {
  const duration = Math.min(8, Math.max(4, Math.round(opts.duration)));
  const resolution = opts.resolution === "720p" ? "720p" : "480p";
  const body: Record<string, unknown> = {
    model: "grok-imagine-video-1.5",
    prompt: opts.prompt,
    duration,
    aspect_ratio: opts.aspect,
    resolution,
  };
  if (opts.imageUrl) body.image = { url: opts.imageUrl };
  const refs = (opts.refs ?? []).filter((u) => u && u !== opts.imageUrl).slice(0, 7);
  if (refs.length) body.reference_images = refs.map((url) => ({ url }));

  let res = await xaiFetch("/videos/generations", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok && refs.length) {
    const fallback = { ...body };
    delete fallback.reference_images;
    res = await xaiFetch("/videos/generations", {
      method: "POST",
      body: JSON.stringify(fallback),
    });
  }
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Video model error ${res.status}: ${t.slice(0, 280)}`);
  }
  const json = (await res.json()) as { request_id?: string };
  if (!json.request_id) throw new Error("Video model returned no request id");
  return json.request_id;
}

export async function xaiPollVideo(
  requestId: string,
): Promise<{ status: "running" | "done" | "failed"; url?: string; error?: string }> {
  const res = await xaiFetch(`/videos/${encodeURIComponent(requestId)}`, {
    method: "GET",
  });
  if (!res.ok) {
    const t = await res.text();
    return { status: "failed", error: t.slice(0, 280) };
  }
  const json = (await res.json()) as {
    status?: string;
    video?: { url?: string };
    error?: string;
  };
  const status = (json.status ?? "running").toLowerCase();
  if (status === "done" || status === "completed" || status === "succeeded") {
    return { status: "done", url: json.video?.url };
  }
  if (status === "failed" || status === "expired" || status === "error") {
    return { status: "failed", error: json.error ?? "Video generation failed" };
  }
  return { status: "running" };
}

export async function materializeUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/")) return url;
  const res = await fetch(url);
  if (!res.ok) return url;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength > 4_500_000) return url;
  const mime = res.headers.get("content-type") || "image/jpeg";
  if (!mime.startsWith("image/")) return url;
  return `data:${mime};base64,${buf.toString("base64")}`;
}
