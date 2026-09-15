import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as MODEL_CATALOG, l as sceneMotionPrompt, o as modelNeedsHf, r as DEFAULT_MODELS, s as resolveModelId, t as ASPECT_PIXELS } from "./models-B2CYspfs.mjs";
import { n as formatSeconds, r as uid, t as cn } from "./utils-DTRwhPEg.mjs";
import { a as Plus, i as Settings, o as ChevronUp, r as Trash2, s as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-2Az3Ub4w.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BMZYOdnM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SAMPLE_SCRIPT = `Title: Paper Birds

A quiet Kyoto workshop. Late afternoon light.

AIKO, a paper artist, folds a crane from white washi. Her hands are ink-stained. She finishes the last crease, sets the bird on the table, and watches.

The crane shivers. Paper wings catch the sun. It lifts off the wood, gold-ink edges flashing, and flies through the open window.

Dusk. Over dark tiled rooftops a white crane glides, lanterns warming the alleys below. It becomes a small bright mark against the indigo sky, and is gone.`;
function createSampleProject() {
	return {
		title: "Paper Birds",
		logline: "A Kyoto paper artist folds a crane that comes alive and flies the dusk rooftops.",
		script: SAMPLE_SCRIPT,
		style: "Cinematic 35mm stills, muted earth and indigo, warm tungsten practicals, fine film grain, magical realism, no text, photoreal paper texture.",
		aspect: "16:9",
		resolution: "480p",
		transition: "crossfade",
		models: { ...DEFAULT_MODELS },
		customModels: {
			script: "",
			character: "",
			frame: "",
			video: ""
		},
		characters: [{
			id: "char_aiko",
			name: "Aiko",
			description: "Japanese woman in her late twenties, short black bob, calm focused face, dark eyes, ink-stained fingertips.",
			wardrobe: "Indigo linen apron over a cream cotton shirt, sleeves rolled.",
			imageUrl: "/sample/aiko.jpg",
			imagePrompt: "Character sheet, Aiko, paper artist"
		}, {
			id: "char_crane",
			name: "The Crane",
			description: "A white origami crane of washi paper, gold-ink edges on the wing folds, visible fiber texture.",
			wardrobe: "Folded white paper, gold-ink lining.",
			imageUrl: "/sample/crane.jpg",
			imagePrompt: "Macro still of the origami crane"
		}],
		scenes: [
			{
				id: "scene_01",
				index: 1,
				title: "The last crease",
				location: "Traditional Japanese paper workshop, late afternoon",
				action: "Aiko sits at a long wooden table and finishes folding a white crane, hands precise in a shaft of sun.",
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
				included: true
			},
			{
				id: "scene_02",
				index: 2,
				title: "First flight",
				location: "The same workshop table",
				action: "The origami crane shivers, paper wings beat, and it lifts off the wood into a shaft of light.",
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
				included: true
			},
			{
				id: "scene_03",
				index: 3,
				title: "Over the roofs",
				location: "Kyoto tiled rooftops at dusk",
				action: "The white crane glides above dark roofs while paper lanterns glow in an alley below.",
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
				included: true
			}
		]
	};
}
function emptyProject() {
	return {
		title: "Untitled reel",
		logline: "",
		script: "",
		style: "",
		aspect: "16:9",
		resolution: "480p",
		transition: "cut",
		models: { ...DEFAULT_MODELS },
		customModels: {
			script: "",
			character: "",
			frame: "",
			video: ""
		},
		characters: [],
		scenes: []
	};
}
var HF_KEY = "emulsion.hf-token";
function getHfToken() {
	if (typeof window === "undefined") return "";
	return sessionStorage.getItem(HF_KEY) ?? "";
}
function setHfToken(token) {
	if (typeof window === "undefined") return;
	if (token) sessionStorage.setItem(HF_KEY, token);
	else sessionStorage.removeItem(HF_KEY);
}
function stripHeavy(project) {
	const strip = (url) => url && url.startsWith("data:") ? void 0 : url;
	return {
		...project,
		finalUrl: strip(project.finalUrl),
		characters: project.characters.map((c) => ({
			...c,
			imageUrl: strip(c.imageUrl)
		})),
		scenes: project.scenes.map((s) => ({
			...s,
			frameUrl: strip(s.frameUrl),
			videoUrl: strip(s.videoUrl)
		}))
	};
}
var useStudio = create()(persist((set, get) => ({
	step: "script",
	project: emptyProject(),
	busy: {},
	hfTokenPresent: false,
	xaiAvailable: null,
	setStep: (step) => set({ step }),
	patchProject: (partial) => set({ project: {
		...get().project,
		...partial
	} }),
	setModel: (slot, id) => set({ project: {
		...get().project,
		models: {
			...get().project.models,
			[slot]: id
		}
	} }),
	setCustomModel: (slot, id) => set({ project: {
		...get().project,
		customModels: {
			...get().project.customModels,
			[slot]: id
		}
	} }),
	loadSample: () => set({
		project: createSampleProject(),
		step: "cut"
	}),
	reset: () => set({
		project: emptyProject(),
		step: "script",
		busy: {}
	}),
	setBusy: (key, value) => set({ busy: {
		...get().busy,
		[key]: value
	} }),
	setXaiAvailable: (v) => set({ xaiAvailable: v }),
	refreshHf: () => set({ hfTokenPresent: Boolean(getHfToken()) }),
	addCharacter: () => {
		const c = {
			id: uid("char"),
			name: "New character",
			description: "",
			wardrobe: ""
		};
		set({ project: {
			...get().project,
			characters: [...get().project.characters, c]
		} });
	},
	updateCharacter: (id, patch) => set({ project: {
		...get().project,
		characters: get().project.characters.map((c) => c.id === id ? {
			...c,
			...patch
		} : c)
	} }),
	removeCharacter: (id) => set({ project: {
		...get().project,
		characters: get().project.characters.filter((c) => c.id !== id),
		scenes: get().project.scenes.map((s) => ({
			...s,
			characterIds: s.characterIds.filter((cid) => cid !== id)
		}))
	} }),
	updateScene: (id, patch) => set({ project: {
		...get().project,
		scenes: get().project.scenes.map((s) => s.id === id ? {
			...s,
			...patch
		} : s)
	} }),
	moveScene: (id, dir) => {
		const scenes = [...get().project.scenes];
		const i = scenes.findIndex((s) => s.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= scenes.length) return;
		const a = scenes[i];
		const b = scenes[j];
		if (!a || !b) return;
		scenes[i] = b;
		scenes[j] = a;
		set({ project: {
			...get().project,
			scenes: scenes.map((s, idx) => ({
				...s,
				index: idx + 1
			}))
		} });
	},
	applyBreakdown: (project) => set({
		project,
		step: "cast"
	})
}), {
	name: "emulsion.project",
	skipHydration: true,
	partialize: (s) => ({
		step: s.step,
		project: stripHeavy(s.project)
	})
}));
var STEPS = [
	{
		id: "script",
		n: "01",
		label: "Script"
	},
	{
		id: "cast",
		n: "02",
		label: "Cast"
	},
	{
		id: "frames",
		n: "03",
		label: "Frames"
	},
	{
		id: "motion",
		n: "04",
		label: "Motion"
	},
	{
		id: "cut",
		n: "05",
		label: "Cut"
	}
];
function StepRail() {
	const step = useStudio((s) => s.step);
	const setStep = useStudio((s) => s.setStep);
	const scenes = useStudio((s) => s.project.scenes.length);
	const chars = useStudio((s) => s.project.characters.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Production steps",
		className: "flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:px-6",
		children: STEPS.map((s) => {
			const active = s.id === step;
			const done = s.id === "script" && scenes > 0 || s.id === "cast" && chars > 0 || s.id === "frames" && useStudio.getState().project.scenes.some((x) => x.frameUrl) || s.id === "motion" && useStudio.getState().project.scenes.some((x) => x.videoUrl);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setStep(s.id),
				className: cn("flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-raised text-fg" : "text-muted hover:text-fg"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] tracking-[0.18em] text-subtle",
						children: s.n
					}),
					s.label,
					done && !active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-1.5 rounded-full bg-ok",
						"aria-hidden": true
					})
				]
			}, s.id);
		})
	});
}
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("flex h-11 w-full rounded-sm border border-border bg-raised px-3 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:border-border-strong", "disabled:opacity-40", className),
	...props
}));
Input.displayName = "Input";
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium uppercase tracking-[0.14em] text-muted", className),
		...props
	});
}
function SelectField({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full appearance-none rounded-sm border border-border bg-raised bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22 stroke=%22%238c8a84%22 stroke-width=%221.6%22><path d=%22M1 1.5 6 6.5 11 1.5%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-fg", "focus-visible:outline-none focus-visible:border-border-strong", className),
		...props,
		children
	});
}
function SettingsButton() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [token, setToken] = (0, import_react.useState)("");
	const project = useStudio((s) => s.project);
	const patch = useStudio((s) => s.patchProject);
	const refreshHf = useStudio((s) => s.refreshHf);
	const xai = useStudio((s) => s.xaiAvailable);
	const hf = useStudio((s) => s.hfTokenPresent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (v) => {
			setOpen(v);
			if (v) setToken(getHfToken());
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Settings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col gap-6 overflow-y-auto border-l border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-2xl",
						children: "Lab settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Pick a Hugging Face model on any step. Grok models run here without a token. Open-weight models need a Hugging Face token with Inference Providers enabled."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "hf-token",
							children: "Hugging Face token"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "hf-token",
							type: "password",
							autoComplete: "off",
							placeholder: "hf_…",
							value: token,
							onChange: (e) => setToken(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setHfToken(token.trim());
								refreshHf();
							},
							children: "Save token on this device"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Stored in session storage only. Never sent except to Hugging Face with the request you start."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.16em] text-subtle uppercase",
							children: "Grok"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: xai ? "Ready" : "Unavailable"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-[0.16em] text-subtle uppercase",
							children: "Hugging Face"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: hf ? "Token set" : "No token"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "aspect",
						children: "Frame"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						id: "aspect",
						value: project.aspect,
						onChange: (e) => patch({ aspect: e.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "16:9",
								children: "16:9 landscape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "9:16",
								children: "9:16 portrait"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "1:1",
								children: "1:1 square"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "res",
						children: "Motion resolution"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						id: "res",
						value: project.resolution,
						onChange: (e) => patch({ resolution: e.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "480p",
							children: "480p — cheaper, faster"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "720p",
							children: "720p"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/space",
					className: "text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
					onClick: () => setOpen(false),
					children: "Hugging Face Space source"
				})
			]
		})] })]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-40 w-full rounded-md border border-border bg-raised px-3 py-3 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:border-border-strong", "disabled:opacity-40 resize-y leading-relaxed", className),
	...props
}));
Textarea.displayName = "Textarea";
var SLOT = {
	script: "script",
	character: "character",
	frame: "frame",
	video: "video"
};
function ModelPicker({ task, label }) {
	const project = useStudio((s) => s.project);
	const setModel = useStudio((s) => s.setModel);
	const setCustom = useStudio((s) => s.setCustomModel);
	const slot = SLOT[task];
	const options = MODEL_CATALOG[task];
	const value = project.models[slot];
	const custom = project.customModels[slot];
	const known = options.some((o) => o.id === value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: `model-${task}`,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
				id: `model-${task}`,
				value: known ? value : "custom",
				onChange: (e) => {
					const v = e.target.value;
					if (v === "custom") setModel(slot, custom || "custom");
					else setModel(slot, v);
				},
				children: [options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: o.id,
					children: [o.label, o.needsHf ? " · HF" : ""]
				}, o.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "custom",
					children: "Custom Hugging Face id"
				})]
			}),
			(!known || value === "custom") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "org/model-name",
				value: custom,
				onChange: (e) => {
					setCustom(slot, e.target.value);
					setModel(slot, e.target.value || "custom");
				}
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getProviderStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("32584b9a8f8df89b83e7a5ea049ab67638f82594434ef71b790581539631a68e"));
var breakdownScript = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("aed8b0bbab8ed351745dce7368a51a7936417da57b4f90f60b199adbf66b3c20"));
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6aeeca4cdad6fdd4a1e5bd02f2aad098e72ceec6e5146dadf66454beef21abe1"));
var startClip = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ea9232855fd68a0ef7c5dcc9355d6cd942ece5e9366afa07e439f9fc455c6415"));
var pollClip = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d69d1e8334b3515d4a6c8d848e7e083c9689f92d351541f122117c51f1174e96"));
function Badge({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted", className),
		children
	});
}
function ScriptStep() {
	const project = useStudio((s) => s.project);
	const patch = useStudio((s) => s.patchProject);
	const apply = useStudio((s) => s.applyBreakdown);
	const busy = useStudio((s) => s.busy.script);
	const setBusy = useStudio((s) => s.setBusy);
	async function runBreakdown() {
		const model = resolveModelId(project.models.script, project.customModels.script);
		if (modelNeedsHf("script", model) && !getHfToken()) {
			toast.error("This model needs a Hugging Face token in settings.");
			return;
		}
		setBusy("script", true);
		try {
			const res = await breakdownScript({ data: {
				script: project.script,
				model,
				hfToken: getHfToken() || void 0
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			apply({
				...project,
				title: res.title,
				logline: res.logline,
				style: res.style || project.style,
				characters: res.characters,
				scenes: res.scenes
			});
			toast.success(`${res.scenes.length} scenes on the slate`);
		} finally {
			setBusy("script", false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.18em] text-subtle uppercase",
						children: "Take 01"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-3xl md:text-4xl",
						children: "Script"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => patch({ script: SAMPLE_SCRIPT }),
						children: "Load sample pages"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: project.script,
					onChange: (e) => patch({ script: e.target.value }),
					placeholder: "Paste a treatment or scene list. Keep it short — six scenes or fewer.",
					className: "min-h-72 font-[inherit] leading-relaxed",
					"aria-label": "Script"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: project.title,
							onChange: (e) => patch({ title: e.target.value })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "logline",
							children: "Logline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "logline",
							value: project.logline,
							onChange: (e) => patch({ logline: e.target.value })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "style",
						children: "Style bible"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "style",
						className: "min-h-24",
						value: project.style,
						onChange: (e) => patch({ style: e.target.value }),
						placeholder: "Lens, grain, palette, era — applied to every still and clip."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex flex-col gap-5 rounded-xl border border-border bg-surface p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {
					task: "script",
					label: "Breakdown model"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => void runBreakdown(),
					children: busy ? "Reading pages…" : "Break into scenes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "The model returns a cast list, a visual bible, and up to six scenes with duration and camera. You can edit every field after."
				}),
				project.scenes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex flex-col gap-3",
					children: project.scenes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Scene ", String(s.index).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-subtle tabular-nums",
									children: [s.duration, "s"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-fg",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: s.action
							})
						]
					}, s.id))
				})
			]
		})]
	});
}
function CastStep() {
	const project = useStudio((s) => s.project);
	const add = useStudio((s) => s.addCharacter);
	const busy = useStudio((s) => Boolean(s.busy.cast));
	async function generateAll() {
		const { setBusy, updateCharacter } = useStudio.getState();
		const model = resolveModelId(project.models.character, project.customModels.character);
		if (modelNeedsHf("character", model) && !getHfToken()) {
			toast.error("This model needs a Hugging Face token in settings.");
			return;
		}
		setBusy("cast", true);
		try {
			for (const c of useStudio.getState().project.characters) {
				const res = await generateStill({ data: {
					kind: "character",
					model,
					hfToken: getHfToken() || void 0,
					aspect: project.aspect,
					character: c,
					style: project.style
				} });
				if (!res.ok) {
					toast.error(`${c.name}: ${res.error}`);
					continue;
				}
				updateCharacter(c.id, {
					imageUrl: res.url,
					imagePrompt: res.prompt
				});
			}
		} finally {
			setBusy("cast", false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.18em] text-subtle uppercase",
				children: "Take 02"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-3xl md:text-4xl",
				children: "Cast"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-64 max-w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {
							task: "character",
							label: "Character sheet model"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: add,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Add"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || project.characters.length === 0,
						onClick: () => void generateAll(),
						children: busy ? "Exposing sheets…" : "Generate all sheets"
					})
				]
			})]
		}), project.characters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { hint: "Break the script first, or add a character by hand." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: project.characters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterCard, { character: c }, c.id))
		})]
	});
}
function Empty({ hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted",
		children: hint
	});
}
function CharacterCard({ character }) {
	const update = useStudio((s) => s.updateCharacter);
	const remove = useStudio((s) => s.removeCharacter);
	const project = useStudio((s) => s.project);
	const busy = useStudio((s) => Boolean(s.busy[`char:${character.id}`]));
	const setBusy = useStudio((s) => s.setBusy);
	async function generateOne() {
		const model = resolveModelId(project.models.character, project.customModels.character);
		if (modelNeedsHf("character", model) && !getHfToken()) {
			toast.error("This model needs a Hugging Face token in settings.");
			return;
		}
		setBusy(`char:${character.id}`, true);
		try {
			const res = await generateStill({ data: {
				kind: "character",
				model,
				hfToken: getHfToken() || void 0,
				aspect: project.aspect,
				character,
				style: project.style
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			update(character.id, {
				imageUrl: res.url,
				imagePrompt: res.prompt
			});
		} finally {
			setBusy(`char:${character.id}`, false);
		}
	}
	function onFile(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") update(character.id, { imageUrl: reader.result });
		};
		reader.readAsDataURL(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[140px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-md bg-raised",
			children: character.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: character.imageUrl,
				alt: character.name,
				className: "aspect-[2/3] h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex aspect-[2/3] items-center justify-center text-xs text-subtle",
				children: "No sheet"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: character.name,
							onChange: (e) => update(character.id, { name: e.target.value })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Remove character",
						onClick: () => remove(character.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Appearance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "min-h-20",
						value: character.description,
						onChange: (e) => update(character.id, { description: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Wardrobe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: character.wardrobe,
						onChange: (e) => update(character.id, { wardrobe: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: busy,
						onClick: () => void generateOne(),
						children: busy ? "Exposing…" : "Generate sheet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-9 cursor-pointer items-center rounded-md border border-border px-3 text-xs",
						children: ["Upload still", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: (e) => onFile(e.target.files?.[0])
						})]
					})]
				})
			]
		})]
	});
}
function FramesStep() {
	const project = useStudio((s) => s.project);
	const busy = useStudio((s) => Boolean(s.busy.frames));
	async function generateAll() {
		const { setBusy, updateScene } = useStudio.getState();
		const model = resolveModelId(project.models.frame, project.customModels.frame);
		if (modelNeedsHf("frame", model) && !getHfToken()) {
			toast.error("This model needs a Hugging Face token in settings.");
			return;
		}
		setBusy("frames", true);
		try {
			for (const scene of useStudio.getState().project.scenes) {
				const chars = project.characters.filter((c) => scene.characterIds.includes(c.id));
				const res = await generateStill({ data: {
					kind: "frame",
					model,
					hfToken: getHfToken() || void 0,
					aspect: project.aspect,
					scene,
					characters: chars,
					style: project.style,
					refs: chars.map((c) => c.imageUrl).filter((u) => Boolean(u))
				} });
				if (!res.ok) {
					toast.error(`${scene.title}: ${res.error}`);
					continue;
				}
				updateScene(scene.id, {
					frameUrl: res.url,
					framePrompt: res.prompt
				});
			}
		} finally {
			setBusy("frames", false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.18em] text-subtle uppercase",
				children: "Take 03"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-3xl md:text-4xl",
				children: "Frames"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-64 max-w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {
						task: "frame",
						label: "Still model"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || project.scenes.length === 0,
					onClick: () => void generateAll(),
					children: busy ? "Exposing stills…" : "Generate all stills"
				})]
			})]
		}), project.scenes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted",
			children: "Break the script into scenes first."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: project.scenes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameCard, { scene: s }, s.id))
		})]
	});
}
function FrameCard({ scene }) {
	const project = useStudio((s) => s.project);
	const update = useStudio((s) => s.updateScene);
	const busy = useStudio((s) => Boolean(s.busy[`frame:${scene.id}`]));
	const setBusy = useStudio((s) => s.setBusy);
	const chars = project.characters.filter((c) => scene.characterIds.includes(c.id));
	async function generateOne() {
		const model = resolveModelId(project.models.frame, project.customModels.frame);
		if (modelNeedsHf("frame", model) && !getHfToken()) {
			toast.error("This model needs a Hugging Face token in settings.");
			return;
		}
		setBusy(`frame:${scene.id}`, true);
		try {
			const res = await generateStill({ data: {
				kind: "frame",
				model,
				hfToken: getHfToken() || void 0,
				aspect: project.aspect,
				scene,
				characters: chars,
				style: project.style,
				refs: chars.map((c) => c.imageUrl).filter((u) => Boolean(u))
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			update(scene.id, {
				frameUrl: res.url,
				framePrompt: res.prompt
			});
		} finally {
			setBusy(`frame:${scene.id}`, false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-xl border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative bg-raised",
			children: [scene.frameUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene.frameUrl,
				alt: "",
				className: "aspect-video w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex aspect-video items-center justify-center text-xs text-subtle",
				children: "No still"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "absolute top-3 left-3 bg-bg/80",
				children: ["Scene ", String(scene.index).padStart(2, "0")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl",
					children: scene.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted",
					children: scene.action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] tracking-wide text-subtle",
					children: chars.map((c) => c.name).join(" · ") || "No cast"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: busy,
					onClick: () => void generateOne(),
					children: busy ? "Exposing…" : scene.frameUrl ? "Reshoot still" : "Shoot still"
				})
			]
		})]
	});
}
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
function waitEvent(target, name) {
	return new Promise((resolve, reject) => {
		const ok = () => {
			cleanup();
			resolve();
		};
		const err = () => {
			cleanup();
			reject(/* @__PURE__ */ new Error(`Media ${name} failed`));
		};
		const cleanup = () => {
			target.removeEventListener(name, ok);
			target.removeEventListener("error", err);
		};
		target.addEventListener(name, ok, { once: true });
		target.addEventListener("error", err, { once: true });
	});
}
function pickMime() {
	for (const t of [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8",
		"video/webm",
		"video/mp4"
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
	return "video/webm";
}
function mediaProxyUrl(url) {
	if (!url) return url;
	if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) return url;
	return `/api/media?u=${encodeURIComponent(url)}`;
}
async function stitchScenes(scenes, opts, onProgress) {
	const clips = scenes.filter((s) => s.included && s.videoUrl);
	if (clips.length === 0) throw new Error("No clips to cut.");
	const { w, h } = ASPECT_PIXELS[opts.aspect];
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	const stream = canvas.captureStream(30);
	const mime = pickMime();
	const recorder = new MediaRecorder(stream, {
		mimeType: mime,
		videoBitsPerSecond: 4e6
	});
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	const stopped = new Promise((resolve) => {
		recorder.onstop = () => resolve();
	});
	recorder.start(200);
	const fade = opts.transition === "crossfade" ? .4 : 0;
	const videos = [];
	try {
		for (let i = 0; i < clips.length; i++) {
			const scene = clips[i];
			const video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.muted = true;
			video.playsInline = true;
			video.preload = "auto";
			video.src = mediaProxyUrl(scene.videoUrl);
			videos.push(video);
			await waitEvent(video, "loadedmetadata");
			const start = Math.min(scene.trimIn, video.duration - .05);
			const end = Math.min(Math.max(scene.trimOut, start + .1), video.duration);
			video.currentTime = start;
			await waitEvent(video, "seeked");
			await video.play();
			const next = clips[i + 1];
			let nextVideo = null;
			if (fade > 0 && next?.videoUrl) {
				nextVideo = document.createElement("video");
				nextVideo.crossOrigin = "anonymous";
				nextVideo.muted = true;
				nextVideo.playsInline = true;
				nextVideo.src = mediaProxyUrl(next.videoUrl);
				videos.push(nextVideo);
				await waitEvent(nextVideo, "loadedmetadata");
				nextVideo.currentTime = next.trimIn;
			}
			while (!video.paused && video.currentTime < end) {
				ctx.fillStyle = "#0b0b0c";
				ctx.fillRect(0, 0, w, h);
				drawCover(ctx, video, w, h);
				const remaining = end - video.currentTime;
				if (nextVideo && remaining < fade) {
					const t = 1 - remaining / fade;
					ctx.save();
					ctx.globalAlpha = Math.min(1, Math.max(0, t));
					if (nextVideo.paused) try {
						await nextVideo.play();
					} catch {}
					drawCover(ctx, nextVideo, w, h);
					ctx.restore();
				}
				onProgress?.((i + (video.currentTime - start) / (end - start)) / clips.length);
				await new Promise((r) => requestAnimationFrame(() => r(null)));
			}
			video.pause();
			nextVideo?.pause();
		}
		await sleep(80);
		recorder.stop();
		await stopped;
	} finally {
		for (const v of videos) {
			v.pause();
			v.src = "";
		}
		stream.getTracks().forEach((t) => t.stop());
	}
	return new Blob(chunks, { type: mime.split(";")[0] });
}
function drawCover(ctx, video, w, h) {
	const vw = video.videoWidth || w;
	const vh = video.videoHeight || h;
	const scale = Math.max(w / vw, h / vh);
	const dw = vw * scale;
	const dh = vh * scale;
	ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
function downloadBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function MotionStep() {
	const project = useStudio((s) => s.project);
	const busy = useStudio((s) => Boolean(s.busy.motion));
	async function generateAll() {
		const { setBusy } = useStudio.getState();
		setBusy("motion", true);
		try {
			for (const scene of useStudio.getState().project.scenes) {
				if (!scene.frameUrl) {
					toast.error(`Scene ${scene.index} needs a still first.`);
					continue;
				}
				await generateScene(scene.id);
			}
		} finally {
			setBusy("motion", false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] tracking-[0.18em] text-subtle uppercase",
					children: "Take 04"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl md:text-4xl",
					children: "Motion"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-64 max-w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelPicker, {
							task: "video",
							label: "Image-to-video model"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || project.scenes.length === 0,
						onClick: () => void generateAll(),
						children: busy ? "Rolling…" : "Generate all clips"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm leading-relaxed text-muted",
				children: "Each still becomes a short clip. Character sheets are passed as references when the model allows it. Clips stay at 4–8 seconds."
			}),
			project.scenes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted",
				children: "Shoot stills before rolling motion."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: project.scenes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionCard, { scene: s }, s.id))
			})
		]
	});
}
async function generateScene(id) {
	const state = useStudio.getState();
	const project = state.project;
	const scene = project.scenes.find((s) => s.id === id);
	if (!scene) return;
	const model = resolveModelId(project.models.video, project.customModels.video);
	if (modelNeedsHf("video", model) && !getHfToken()) {
		toast.error("This model needs a Hugging Face token in settings.");
		return;
	}
	if (!scene.frameUrl) {
		toast.error("Shoot a still for this scene first.");
		return;
	}
	state.setBusy(`clip:${id}`, true);
	state.updateScene(id, {
		videoStatus: "running",
		videoError: void 0
	});
	try {
		const chars = project.characters.filter((c) => scene.characterIds.includes(c.id));
		const res = await startClip({ data: {
			model,
			hfToken: getHfToken() || void 0,
			scene,
			characters: chars,
			style: project.style,
			aspect: project.aspect,
			resolution: project.resolution
		} });
		if (!res.ok) {
			state.updateScene(id, {
				videoStatus: "error",
				videoError: res.error
			});
			toast.error(res.error);
			return;
		}
		state.updateScene(id, { videoPrompt: res.prompt });
		if (res.immediate && res.url) {
			state.updateScene(id, {
				videoUrl: res.url,
				videoStatus: "done",
				trimOut: scene.duration
			});
			return;
		}
		state.updateScene(id, {
			videoRequestId: res.requestId,
			videoStatus: "running"
		});
	} catch (err) {
		state.updateScene(id, {
			videoStatus: "error",
			videoError: err instanceof Error ? err.message : "Failed"
		});
	} finally {
		state.setBusy(`clip:${id}`, false);
	}
}
function MotionCard({ scene }) {
	const project = useStudio((s) => s.project);
	const update = useStudio((s) => s.updateScene);
	const busy = useStudio((s) => Boolean(s.busy[`clip:${scene.id}`]));
	const chars = project.characters.filter((c) => scene.characterIds.includes(c.id));
	(0, import_react.useEffect)(() => {
		if (!scene.videoRequestId || scene.videoStatus !== "running") return;
		let stop = false;
		const model = resolveModelId(project.models.video, project.customModels.video);
		const tick = async () => {
			const res = await pollClip({ data: {
				requestId: scene.videoRequestId,
				model
			} });
			if (stop) return;
			if (!res.ok) {
				update(scene.id, {
					videoStatus: "error",
					videoError: res.error
				});
				return;
			}
			if (res.status === "done" && res.url) {
				update(scene.id, {
					videoUrl: res.url,
					videoStatus: "done",
					videoRequestId: void 0,
					trimOut: scene.duration
				});
				return;
			}
			if (res.status === "failed") {
				update(scene.id, {
					videoStatus: "error",
					videoError: res.error ?? "Generation failed",
					videoRequestId: void 0
				});
				return;
			}
			window.setTimeout(() => void tick(), 4e3);
		};
		tick();
		return () => {
			stop = true;
		};
	}, [
		scene.videoRequestId,
		scene.videoStatus,
		scene.id,
		scene.duration,
		project.models.video,
		project.customModels.video,
		update
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "grid gap-4 rounded-xl border border-border bg-surface p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-md bg-raised",
			children: scene.videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: mediaProxyUrl(scene.videoUrl),
				controls: true,
				playsInline: true,
				className: "aspect-video w-full bg-bg"
			}) : scene.frameUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: scene.frameUrl,
				alt: "",
				className: "aspect-video w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex aspect-video items-center justify-center text-xs text-subtle",
				children: "No plate"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Scene ", String(scene.index).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-subtle",
						children: scene.videoStatus === "running" ? "In process" : scene.videoStatus === "error" ? "Failed" : scene.videoUrl ? "Print" : "Idle"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl",
					children: scene.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: scene.camera
				}),
				scene.videoError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: scene.videoError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (seconds)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 4,
						max: 8,
						value: scene.duration,
						onChange: (e) => {
							const d = Math.min(8, Math.max(4, Number(e.target.value) || 5));
							update(scene.id, {
								duration: d,
								trimOut: d
							});
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-3 font-mono text-[11px] leading-relaxed text-subtle",
					children: scene.videoPrompt || sceneMotionPrompt(scene, chars, project.style)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: busy || scene.videoStatus === "running",
					onClick: () => void generateScene(scene.id),
					children: scene.videoStatus === "running" ? "Processing…" : scene.videoUrl ? "Reshoot clip" : "Roll clip"
				})
			]
		})]
	});
}
function Slider({ className, ...props }) {
	const thumbs = props.value ?? props.defaultValue ?? [0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-raised",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), thumbs.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-border-strong bg-fg shadow-sm" }, i))]
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-border bg-raised transition-colors data-[state=checked]:bg-accent", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-4 translate-x-1 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-accent-fg" })
	});
}
function Progress({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1 w-full overflow-hidden rounded-full bg-raised", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-accent transition-[width] duration-200 ease-[var(--ease-out)]",
			style: { width: `${Math.min(100, Math.max(0, value))}%` }
		})
	});
}
function CutStep() {
	const project = useStudio((s) => s.project);
	const patch = useStudio((s) => s.patchProject);
	const update = useStudio((s) => s.updateScene);
	const move = useStudio((s) => s.moveScene);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [working, setWorking] = (0, import_react.useState)(false);
	const clips = project.scenes.filter((s) => s.videoUrl);
	const included = clips.filter((s) => s.included);
	async function stitch() {
		if (included.length === 0) {
			toast.error("Include at least one clip.");
			return;
		}
		setWorking(true);
		setProgress(0);
		try {
			const blob = await stitchScenes(project.scenes, {
				aspect: project.aspect,
				transition: project.transition
			}, setProgress);
			const url = URL.createObjectURL(blob);
			if (project.finalUrl?.startsWith("blob:")) URL.revokeObjectURL(project.finalUrl);
			patch({ finalUrl: url });
			toast.success("Final print is ready");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Stitch failed");
		} finally {
			setWorking(false);
		}
	}
	async function download() {
		if (!project.finalUrl) return;
		downloadBlob(await (await fetch(project.finalUrl)).blob(), `${(project.title || "emulsion").toLowerCase().replace(/\s+/g, "-")}.webm`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] tracking-[0.18em] text-subtle uppercase",
				children: "Take 05"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-3xl md:text-4xl",
				children: "Cut"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "trans",
						children: "Transition"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						id: "trans",
						value: project.transition,
						onChange: (e) => patch({ transition: e.target.value }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cut",
							children: "Hard cut"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "crossfade",
							children: "Crossfade"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: working || included.length === 0,
					onClick: () => void stitch(),
					children: working ? "Conforming…" : "Conform reel"
				})]
			})]
		}), clips.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted",
			children: "Roll motion clips before cutting. Or load the sample reel from the header."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-3",
				children: project.scenes.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-9",
									disabled: i === 0,
									"aria-label": "Move up",
									onClick: () => move(s.id, -1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-9",
									disabled: i === project.scenes.length - 1,
									"aria-label": "Move down",
									onClick: () => move(s.id, 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-28 shrink-0 overflow-hidden rounded-sm bg-raised",
								children: s.videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: mediaProxyUrl(s.videoUrl),
									poster: s.frameUrl,
									muted: true,
									playsInline: true,
									className: "aspect-video w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex aspect-video items-center justify-center text-[10px] text-subtle",
									children: "Empty"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["SC ", String(s.index).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "truncate text-sm",
											children: s.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: `inc-${s.id}`,
											className: "normal-case tracking-normal",
											children: "Include"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											id: `inc-${s.id}`,
											checked: s.included,
											onCheckedChange: (v) => update(s.id, { included: v }),
											disabled: !s.videoUrl
										})]
									})]
								}), s.videoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-1 font-mono text-[10px] text-subtle tabular-nums",
										children: [
											formatSeconds(s.trimIn),
											" — ",
											formatSeconds(s.trimOut)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										min: 0,
										max: s.duration,
										step: .1,
										value: [s.trimIn, s.trimOut],
										onValueChange: ([a, b]) => update(s.id, {
											trimIn: Math.min(a, b),
											trimOut: Math.max(a, b)
										})
									})]
								})]
							})
						]
					})
				}, s.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-xl border border-border bg-raised",
						children: project.finalUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: project.finalUrl,
							controls: true,
							playsInline: true,
							className: "aspect-video w-full bg-bg"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-video items-center justify-center px-6 text-center text-sm text-muted",
							children: "Conform the reel to preview the joined print."
						})
					}),
					working && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress * 100 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: !project.finalUrl,
						onClick: () => void download(),
						children: "Download reel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-subtle",
						children: "Trims and transitions are applied in the browser. The download is a WebM print of the timeline."
					})
				]
			})]
		})]
	});
}
function StudioShell() {
	const step = useStudio((s) => s.step);
	const title = useStudio((s) => s.project.title);
	const loadSample = useStudio((s) => s.loadSample);
	const reset = useStudio((s) => s.reset);
	const setXai = useStudio((s) => s.setXaiAvailable);
	const refreshHf = useStudio((s) => s.refreshHf);
	(0, import_react.useEffect)(() => {
		useStudio.persist.rehydrate();
		refreshHf();
		getProviderStatus().then((s) => setXai(s.xai));
	}, [refreshHf, setXai]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "film-grain flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-2xl tracking-tight",
						children: "Emulsion"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate font-mono text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: [title || "Untitled reel", " · script to screen"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: loadSample,
							children: "Sample reel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: reset,
							children: "New"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/space",
							className: "hidden h-11 items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex",
							children: "Space"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsButton, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepRail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [
					step === "script" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptStep, {}),
					step === "cast" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CastStep, {}),
					step === "frames" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FramesStep, {}),
					step === "motion" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionStep, {}),
					step === "cut" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CutStep, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				toastOptions: { className: "bg-surface text-fg border border-border" }
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioShell, {});
}
//#endregion
export { Home as component };
