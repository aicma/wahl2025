import { useEffect, useState } from "react"
import { importCsv } from "@/lib/importCsv"
import type { GebietOption } from "@/lib/idb"
import { kerg2RowSchema, type ResultRow } from "@/schema/kerg2"
import { GebietPanel } from "@/components/GebietPanel"
import { Button } from "@/components/ui/button"

const BTW25_CSV_URL =
  "/csv-proxy/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg2.csv"
const BTW25_PARSE_OPTIONS = {
  delimiter: ";",
  skipLines: 9,
  rowSchema: kerg2RowSchema,
}

export function App() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  )
  const [options, setOptions] = useState<GebietOption[]>([])
  const [resultRows, setResultRows] = useState<ResultRow[]>([])
  const [panelIds, setPanelIds] = useState<number[]>([0])
  // On mount, load Gebiet options from IndexedDB
  useEffect(() => {
    let ignore = false
    setLoading(true)

    importCsv(BTW25_CSV_URL, BTW25_PARSE_OPTIONS)
      .then((records) => {
        if (ignore) return
        setResultRows(records)

        setOptions(
          records.reduce<GebietOption[]>((acc, row) => {
            if (
              !acc.some(
                (o) => o.key === `${row.Gebietsart}${row.Gebietsnummer}`
              )
            ) {
              acc.push({
                key: `${row.Gebietsart}${row.Gebietsnummer}`,
                gebietsart: row.Gebietsart,
                gebietsnummer: row.Gebietsnummer,
                gebietsname: row.Gebietsname,
              })
            }
            return acc
          }, [])
        )
      })
      .catch((error) => {
        const msg = error instanceof Error ? error.message : String(error)
        setStatus({ ok: false, message: msg })
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  if (loading)
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Loading election results...
        </p>
      </div>
    )

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Bundestagswahl 2025 — Ergebnisse
        </h1>

        {status && (
          <p
            className={`text-sm ${status.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
          >
            {status.message}
          </p>
        )}
        <div className="flex gap-4">
          {panelIds.map((id) => (
            <GebietPanel
              key={id}
              options={options}
              resultRows={resultRows}
              onClose={() => setPanelIds((ids) => ids.filter((i) => i !== id))}
            />
          ))}
        </div>
        <Button
          variant="outline"
          className="self-start"
          onClick={() => setPanelIds((ids) => [...ids, Math.max(...ids) + 1])}
        >
          + Add Gebiet
        </Button>
      </div>
    </div>
  )
}

export default App
