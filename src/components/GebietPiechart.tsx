import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
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

export function GebietPiechart({ resultRows }: GebietPiechartProps) {
  const data: ChartDatum[] = resultRows
    .filter((row) => row.Stimme === 2 && row.Anzahl != null && row.Anzahl > 0)
    .map((row) => ({
      name: row.Gruppenname,
      value: row.Anzahl as number,
      percent: row.Prozent,
    }))

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Keine Zweitstimmenergebnisse vorhanden.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
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
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => value.toLocaleString("de-DE")} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
