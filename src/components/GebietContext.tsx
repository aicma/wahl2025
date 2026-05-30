import type { ResultRow } from "@/schema/kerg2"

interface GebietContextProps {
  systemRows: ResultRow[]
  stimmme?: number
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

export function GebietContext({ systemRows }: GebietContextProps) {
  const find = (gruppenname: string, stimme?: number) =>
    systemRows.find(
      (r) =>
        r.Gruppenname === gruppenname &&
        (stimme === undefined || r.Stimme === stimme)
    )

  const wahlberechtigte = find("Wahlberechtigte")
  const waehlende = find("Wählende")
  const ungueltigeErst = find("Ungültige", 1)
  const ungueltigeZweit = find("Ungültige", 2)
  const gueltigeErst = find("Gültige", 1)
  const gueltigeZweit = find("Gültige", 2)

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
