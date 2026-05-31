import {
  PieChart,
  Pie,
  Sector,
  type PieSectorShapeProps,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import type { ResultRow } from "@/schema/kerg2"
import { getPartyColor } from "@/lib/utils"

interface GebietPiechartProps {
  resultRows: ResultRow[]
}

interface ChartDatum {
  name: string
  value: number
  percent: number | undefined
  fill: string
}

const PieSector = (props: PieSectorShapeProps) => <Sector {...props} />

export function GebietPiechart({ resultRows }: GebietPiechartProps) {
  const qualifying = resultRows.filter(
    (row) => row.Anzahl != null && row.Anzahl > 0
  )

  const main = qualifying
    .filter((row) => row.Prozent != null && row.Prozent >= 1)
    .map((row) => ({
      name: row.Gruppenname,
      value: row.Anzahl as number,
      percent: row.Prozent ?? undefined,
    }))

  const [otherAnzahl, otherPercent] = qualifying
    .filter((row) => row.Prozent == null || row.Prozent < 1)
    .reduce(
      ([anzahlSum, percentSum], row) => [
        anzahlSum + (row.Anzahl as number),
        percentSum + (row.Prozent as number || 0),
      ],
      [0, 0]
    )

  const rawData =
    otherAnzahl > 0
      ? [...main, { name: "Sonstige", value: otherAnzahl, percent: otherPercent }]
      : main

  const data: ChartDatum[] = rawData.map((d, i) => ({
    ...d,
    fill: getPartyColor(d.name, i),
  }))

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: "var(--foreground)" }])
  )

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Zweitstimmenergebnisse vorhanden.
      </p>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-2/3 md:aspect-video xs:aspect-2/3 max-h-[320px] sm:min-h-[360px] min-h-[200px] w-full">
      <PieChart accessibilityLayer margin={{ left: 70, right: 70, top: 20, bottom: 20 }}>
        <Pie
          data={data}
          dataKey="percent"
          nameKey="name"
          label={({ name, percent, x, y, textAnchor, dominantBaseline }) => (
            <text x={x} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline} fill="currentColor" fontSize={12}>
              {percent != null
                ? `${name} ${percent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
                : name}
            </text>
          )}
          shape={PieSector}
        />
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  )
}
