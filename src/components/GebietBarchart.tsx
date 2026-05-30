import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import type { GebietOption } from "@/lib/idb"
import type { ResultRow } from "@/schema/kerg2"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

interface GebietBarchartProps {
  selectedKeys: (string | null)[]
  options: GebietOption[]
  resultRows: ResultRow[]
}

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#9333ea",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#0284c7",
]

interface BarDatum {
  partei: string
  [gebietName: string]: number | string
}

export function GebietBarchart({
  selectedKeys,
  options,
  resultRows,
}: GebietBarchartProps) {
  const activeKeys = selectedKeys.filter((k): k is string => k !== null)

  if (activeKeys.length < 2) return null

  const gebiete = activeKeys.map((key) => ({
    key,
    name: options.find((o) => o.key === key)?.gebietsname ?? key,
    rows: resultRows.filter(
      (r) =>
        `${r.Gebietsart}${r.Gebietsnummer}` === key &&
        r.Gruppenart !== "System-Gruppe" &&
        r.Stimme === 2 &&
        r.Prozent != null &&
        r.Prozent > 1 // Filter out parties with less than 1% to reduce clutter
    ),
  }))

  // Collect union of all party names across selected Gebiete
  const allParties = Array.from(
    new Set(gebiete.flatMap((g) => g.rows.map((r) => r.Gruppenname)))
  ).sort()

  if (allParties.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Vergleichsdaten verfügbar.
      </p>
    )
  }

  const data: BarDatum[] = allParties.map((partei) => {
    const entry: BarDatum = { partei }
    for (const gebiet of gebiete) {
      const row = gebiet.rows.find((r) => r.Gruppenname === partei)
      entry[gebiet.name] = row?.Prozent ?? 0
    }
    return entry
  })

  return (
    <div className="sticky top-0 z-10 rounded-lg border bg-background p-4">
      <h3 className="mb-3 text-sm font-semibold">Zweitstimmen-Vergleich (%)</h3>
      <ChartContainer config={{}} className="h-[200px] min-h-[200px] w-full">
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="partei"
            tick={{ fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => `${v} %`}
            tick={{ fontSize: 11 }}
            width={52}
          />

          <Legend verticalAlign="top" />
          {gebiete.map((gebiet, i) => (
            <Bar
              key={gebiet.key}
              dataKey={gebiet.name}
              fill={COLORS[i % COLORS.length]}
              maxBarSize={32}
            />
          ))}
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">
        Hinweis: Nur Parteien mit mindestens 1% Stimmenanteil werden angezeigt.
      </p>
    </div>
  )
}
