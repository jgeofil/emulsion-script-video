import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DTRwhPEg.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function formatSeconds(n) {
	const s = Math.max(0, n);
	const m = Math.floor(s / 60);
	const r = s % 60;
	if (m > 0) return `${m}:${String(Math.floor(r)).padStart(2, "0")}`;
	return `${r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)}s`;
}
//#endregion
export { formatSeconds as n, uid as r, cn as t };
