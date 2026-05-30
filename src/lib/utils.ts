import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = {
  SPD: "#dc2626",
  CDU: "#000",
  CSU: "#000",
  GRÜNE: "#16a34a",
  FDP: "#d9c406",
  LINKE: "#e433ea",
  AFD: "#0891b2",
  OTHER: [
      "#5c4123",
      "#724a97",
      "#253f2d",
      "#2b7075",
      "#ea580c",
      "#0284c7",
      "#7c3aed",
      "#059669",
  ],
}

/** Returns the canonical color for a party name, falling back to OTHER palette. */
export function getPartyColor(name: string, otherIndex: number = 0): string {
  const upper = name.toUpperCase()
  for (const key of Object.keys(COLORS) as (keyof typeof COLORS)[]) {
    if (key === "OTHER") continue
    if (upper.includes(key)) return COLORS[key] as string
  }
  return COLORS.OTHER[otherIndex % COLORS.OTHER.length]
}