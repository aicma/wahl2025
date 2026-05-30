#!/usr/bin/env node
/**
 * Downloads the Bundestagswahl 2025 CSV so it can be served as a static asset
 * on GitHub Pages (where the Vite dev-server proxy is not available).
 */
import { createWriteStream, mkdirSync } from "fs"
import { pipeline } from "stream/promises"
import path from "path"
import { fileURLToPath } from "url"

const CSV_URL =
  "https://www.bundeswahlleiterin.de/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg2.csv"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, "../public/data")
const OUT_FILE = path.join(OUT_DIR, "kerg2.csv")

mkdirSync(OUT_DIR, { recursive: true })

console.log(`Fetching ${CSV_URL} …`)
const res = await fetch(CSV_URL)
if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
await pipeline(res.body, createWriteStream(OUT_FILE))
console.log(`Saved to ${OUT_FILE}`)
