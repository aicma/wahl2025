import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Sector,
  type PieSectorShapeProps,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ResultRow } from "@/schema/kerg2"

interface GebietPiechartProps {
  resultRows: ResultRow[]
}

const COLORS = [
  "#2563eb", // blue-600
  "#dc2626", // red-600
  "#16a34a", // green-600
  "#d97706", // amber-600
  "#9333ea", // purple-600
  "#0891b2", // cyan-600
  "#db2777", // pink-600
  "#65a30d", // lime-600
  "#ea580c", // orange-600
  "#0284c7", // sky-600
  "#7c3aed", // violet-600
  "#059669", // emerald-600
]

interface ChartDatum {
  name: string
  value: number
  percent: number | undefined
}
const PieSector = (props: PieSectorShapeProps) => (
  <Sector {...props} fill={COLORS[props.index % COLORS.length]} />
)

export function GebietPiechart({ resultRows }: GebietPiechartProps) {
  const qualifying = resultRows.filter(
    (row) => row.Stimme === 2 && row.Anzahl != null && row.Anzahl > 0
  )

  const main: ChartDatum[] = qualifying
    .filter((row) => row.Prozent != null && row.Prozent >= 1)
    .map((row) => ({
      name: row.Gruppenname,
      value: row.Anzahl as number,
      percent: row.Prozent ?? undefined,
    }))

  const otherAnzahl = qualifying
    .filter((row) => row.Prozent == null || row.Prozent < 1)
    .reduce((sum, row) => sum + (row.Anzahl as number), 0)

  const totalAnzahl = qualifying.reduce(
    (sum, row) => sum + (row.Anzahl as number),
    0
  )

  const data: ChartDatum[] =
    otherAnzahl > 0
      ? [
          ...main,
          {
            name: "Sonstige",
            value: otherAnzahl,
            percent: totalAnzahl > 0 ? (otherAnzahl / totalAnzahl) * 100 : 0,
          },
        ]
      : main

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Zweitstimmenergebnisse vorhanden.
      </p>
    )
  }

  return (
    <ChartContainer config={{}} className="max-h-[320px] min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart accessibilityLayer>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, percent }) =>
              percent != null
                ? `${name} ${percent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
                : name
            }
            labelLine={false}
            shape={PieSector}
          ></Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
