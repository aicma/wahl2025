import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  type PieSectorShapeProps,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ResultRow } from "@/schema/kerg2"
import { getPartyColor } from "@/lib/utils"

interface GebietPiechartProps {
  resultRows: ResultRow[]
}

interface ChartDatum {
  name: string
  value: number
  percent: number | undefined
}

const PieSector = (
  props: PieSectorShapeProps & { name?: string; index?: number }
) => (
  <Sector {...props} fill={getPartyColor(props.name ?? "", props.index ?? 0)} />
)

export function GebietPiechart({ resultRows }: GebietPiechartProps) {
  const qualifying = resultRows.filter(
    (row) => row.Anzahl != null && row.Anzahl > 0
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
      <PieChart accessibilityLayer>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            percent != null
              ? `${name} ${percent.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
              : name
          }
          shape={PieSector}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}
