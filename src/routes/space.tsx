import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/space")({ component: SpacePage });

function SpacePage() {
  return (
    <div className="film-grain min-h-dvh bg-bg text-fg">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Emulsion
        </Link>
        <Link
          to="/"
          className="text-sm text-muted hover:text-fg"
        >
          Back to the lab
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 md:px-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-subtle uppercase">
            Hugging Face
          </p>
          <h1 className="mt-2 font-display text-4xl">Space source</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            The same pipeline ships as a Gradio Space: script breakdown, character
            sheets, scene stills, image-to-video, then a conformed reel. Each
            stage has its own model picker.
          </p>
        </div>
        <ol className="flex flex-col gap-4 text-sm leading-relaxed text-muted">
          <li>
            <span className="font-mono text-subtle">01</span> Create a Space with
            SDK Gradio.
          </li>
          <li>
            <span className="font-mono text-subtle">02</span> Upload{" "}
            <code className="text-fg">space/app.py</code>,{" "}
            <code className="text-fg">space/requirements.txt</code>, and{" "}
            <code className="text-fg">space/README.md</code>.
          </li>
          <li>
            <span className="font-mono text-subtle">03</span> Add secrets{" "}
            <code className="text-fg">HF_TOKEN</code> and, optionally,{" "}
            <code className="text-fg">XAI_API_KEY</code>.
          </li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <a href="/emulsion-space.zip" download>
            <Button>Download Space zip</Button>
          </a>
          <a
            href="https://huggingface.co/new-space"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline">Open Hugging Face</Button>
          </a>
        </div>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">Models per step</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
                Script
              </dt>
              <dd className="text-muted">
                Grok 4.5, Qwen 2.5 72B, Llama 3.3 70B, Mistral Small, Gemma 3
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
                Cast and frames
              </dt>
              <dd className="text-muted">
                Grok Imagine Image 2.0, FLUX.1, Qwen Image, SD 3.5, SDXL Lightning
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">
                Motion
              </dt>
              <dd className="text-muted">
                Grok Imagine Video 1.5, LTX 2.5, Wan 2.2 I2V, CogVideoX I2V
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
