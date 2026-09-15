import { createFileRoute } from "@tanstack/react-router";

const ALLOW = [
  "vidgen.x.ai",
  "imgen.x.ai",
  "cdn.x.ai",
  "api.x.ai",
  "huggingface.co",
  "hf.co",
  "cdn-lfs.huggingface.co",
  "replicate.delivery",
  "fal.media",
  "fal.ai",
];

function hostAllowed(hostname: string): boolean {
  return ALLOW.some((h) => hostname === h || hostname.endsWith(`.${h}`));
}

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("u");
        if (!raw) return new Response("Missing url", { status: 400 });
        let target: URL;
        try {
          target = new URL(raw);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (target.protocol !== "https:" || !hostAllowed(target.hostname)) {
          return new Response("Host not allowed", { status: 400 });
        }
        const upstream = await fetch(target.toString());
        if (!upstream.ok) {
          return new Response("Upstream error", { status: upstream.status });
        }
        const headers = new Headers();
        const ctype = upstream.headers.get("content-type");
        if (ctype) headers.set("content-type", ctype);
        headers.set("cache-control", "private, max-age=3600");
        headers.set("access-control-allow-origin", "*");
        return new Response(upstream.body, { headers });
      },
    },
  },
});
