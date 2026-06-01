import type { ResultRow } from "@/schema/kerg2"

interface GebietContextProps {
  systemRows: ResultRow[]
}

interface StatItem {
  label: string
  value: number | string | null | undefined
  unit?: string
}

function StatRow({ label, value, unit }: StatItem) {
  const display =
    value == null ? "—" : unit ? `${value} ${unit}` : String(value)
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{display}</span>
    </div>
  )
}

/**
 * Takes the system rows of a Gebiet and extracts contextual information such as the number of eligible voters, actual voters, and voter turnout. 
 * This information is then displayed in a structured format. If no relevant information is found, the component returns null.
 */
export function GebietContext({ systemRows }: GebietContextProps) {
  const find = (gruppenname: string, stimme?: number) =>
    systemRows.find(
      (r) =>
        r.Gruppenname === gruppenname &&
        (stimme === undefined || r.Stimme === stimme)
    )

  const wahlberechtigte = find("Wahlberechtigte")
  const waehlende = find("Wählende")

  if (!waehlende && !wahlberechtigte) {
    return null
  }

  return (
    <div className="space-y-2 rounded-md border p-4">
      <h3 className="text-sm font-semibold">Wahlbeteiligung & Stimmen</h3>
      <div className="space-y-1">
        <StatRow
          label="Wahlberechtigte"
          value={wahlberechtigte?.Anzahl?.toLocaleString("de-DE")}
        />
        <StatRow
          label="Wählende"
          value={waehlende?.Anzahl?.toLocaleString("de-DE")}
        />
        <StatRow
          label="Wahlbeteiligung"
          value={waehlende?.Prozent?.toLocaleString("de-DE", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          unit="%"
        />
      </div>
    </div>
  )
}
