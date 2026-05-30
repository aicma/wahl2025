import { useEffect, useState } from "react"
import { importCsv } from "@/lib/importCsv"
import type { GebietOption } from "@/schema/gebietOptions"
import { kerg2RowSchema, type ResultRow } from "@/schema/kerg2"
import { GebietPanel } from "@/components/GebietPanel"
import { GebietBarchart } from "@/components/GebietBarchart"
import { Button } from "@/components/ui/button"
import { useGebietSelection } from "@/lib/hooks/useGebietSelection"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

const BTW25_CSV_URL = import.meta.env.DEV
  ? "/csv-proxy/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg2.csv"
  : "/wahl2025/data/kerg2.csv"
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
  const { selectedKeys, updateKey, removePanel, addPanel } =
    useGebietSelection()

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
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Bundestagswahl 2025 — Ergebnisse
          </h1>
          <ThemeSwitcher />
        </div>

        {status && (
          <p
            className={`text-sm ${status.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
          >
            {status.message}
          </p>
        )}
        {selectedKeys.length >= 2 && (
          <GebietBarchart
            selectedKeys={selectedKeys}
            options={options}
            resultRows={resultRows}
          />
        )}
        <div
          className={`grid gap-4 ${selectedKeys.length > 1 ? "grid-cols-2" : ""}`}
        >
          {selectedKeys.map((key, index) => (
            <GebietPanel
              key={index}
              options={options}
              resultRows={resultRows}
              selectedKey={key}
              onSelect={(option) => updateKey(index, option)}
              onClose={() => removePanel(index)}
            />
          ))}
        </div>
        <Button
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full"
          onClick={() => addPanel()}
        >
          + Add Gebiet
        </Button>
      </div>
    </div>
  )
}

export default App
