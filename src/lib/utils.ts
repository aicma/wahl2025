import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLORS = {
  SPD: "#e3000f",   // SPD brand red
  CDU: "#151515",   // CDU black
  CSU: "#0080c8",   // CSU brand blue
  GRÜNE: "#46962b", // Grüne brand green
  FDP: "#ffed00",   // FDP brand yellow
  LINKE: "#be3075", // Linke brand magenta
  AFD: "#009ee0",   // AfD brand light blue
  BSW: "#9b1c1c",   // BSW dark burgundy (distinct from SPD bright red)
  SSW: "#003f91",   // SSW dark navy (distinct from CSU/AfD blues)
  OTHER: [
    "#ea580c", // orange
    "#0d9488", // teal
    "#7c3aed", // violet
    "#92400e", // amber-brown
    "#475569", // slate
    "#d97706", // dark amber
    "#0f766e", // dark teal
    "#6d28d9", // deep purple
  ],
}

/** Returns the canonical color for a party name, falling back to OTHER palette. */
export function getPartyColor(name: string, otherIndex: number = 0): string {
  const upper = name.toUpperCase()
  // Order matters: check longer/more-specific keys before short ones to avoid
  // "BSW" accidentally matching "SW" in SSW, etc.
  const keys: (keyof typeof COLORS)[] = ["GRÜNE", "LINKE", "BSW", "SSW", "SPD", "CDU", "CSU", "FDP", "AFD"]
  for (const key of keys) {
    if (upper.includes(key)) return COLORS[key] as string
  }
  return COLORS.OTHER[otherIndex % COLORS.OTHER.length]
}