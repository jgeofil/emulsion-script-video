import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatSeconds(n: number): string {
  const s = Math.max(0, n);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m > 0) return `${m}:${String(Math.floor(r)).padStart(2, "0")}`;
  return `${r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)}s`;
}
