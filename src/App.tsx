import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { GebietSearch } from "@/components/GebietSearch"
import { GebietResultsTable } from "@/components/GebietResultsTable"
import {
  importCsv,
  queryGebietOptions,
  queryGebietResults,
} from "@/lib/importCsv"
import { useGebietSelection } from "@/lib/useGebietSelection"
import type { GebietOption } from "@/lib/idb"
import { kerg2RowSchema, type ResultRow } from "@/schema/kerg2"

const BTW25_CSV_URL =
  "/csv-proxy/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg2.csv"
const BTW25_PARSE_OPTIONS = {
  delimiter: ";",
  skipLines: 9,
  rowSchema: kerg2RowSchema,
}
const LAST_IMPORT_KEY = "csv-import-last-imported-at"

export function App() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  )
  const [lastImportedAt, setLastImportedAt] = useState<string | null>(() =>
    localStorage.getItem(LAST_IMPORT_KEY)
  )
  const [optionsLoaded, setOptionsLoaded] = useState(false)
  const [options, setOptions] = useState<GebietOption[]>([])
  const [selectedGebietKey, setSelectedGebietKey] = useGebietSelection(options)
  const [resultRows, setResultRows] = useState<ResultRow[]>([])
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)

  const selected = options.find((o) => o.key === selectedGebietKey) || null
  // On mount, load Gebiet options from IndexedDB
  useEffect(() => {
    let ignore = false

    queryGebietOptions(BTW25_CSV_URL)
      .then((loadedOptions) => {
        if (!ignore) {
          setOptions(loadedOptions)
        }
      })
      .catch(() => {
        /* silent — no stored data yet */
      })
      .finally(() => {
        if (!ignore) {
          setOptionsLoaded(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!optionsLoaded || options.length === 0) {
      setResultRows([])
      setResultsLoading(false)
      setResultsError(null)
      return
    }

    if (!selectedGebietKey) {
      setResultRows([])
      setResultsLoading(false)
      setResultsError(null)
      return
    }

    let ignore = false

    setResultsLoading(true)
    setResultsError(null)

    queryGebietResults(BTW25_CSV_URL, selectedGebietKey)
      .then((rows) => {
        if (!ignore) {
          setResultRows(rows)
        }
      })
      .catch((error) => {
        if (!ignore) {
          setResultRows([])
          setResultsError(
            error instanceof Error ? error.message : String(error)
          )
        }
      })
      .finally(() => {
        if (!ignore) {
          setResultsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [lastImportedAt, options.length, optionsLoaded, selectedGebietKey])

  async function handleImport() {
    setLoading(true)
    setStatus(null)
    try {
      await importCsv(BTW25_CSV_URL, BTW25_PARSE_OPTIONS)
      const now = new Date().toISOString()
      localStorage.setItem(LAST_IMPORT_KEY, now)
      setLastImportedAt(now)
      const opts = await queryGebietOptions(BTW25_CSV_URL)
      setOptions(opts)
      setStatus({
        ok: true,
        message: `Imported ${opts.length > 0 ? "data" : "0 records"} successfully.`,
      })
    } catch (err) {
      setStatus({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Bundestagswahl 2025 — Ergebnisse
        </h1>

        <div className="flex items-center gap-4">
          <Button onClick={handleImport} disabled={loading}>
            {loading ? "Importing…" : options.length > 0 ? "Refresh" : "Import"}
          </Button>
          {lastImportedAt && (
            <span className="text-sm text-muted-foreground">
              Last imported: {new Date(lastImportedAt).toLocaleString()}
            </span>
          )}
        </div>

        {status && (
          <p
            className={`text-sm ${status.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
          >
            {status.message}
          </p>
        )}

        <GebietSearch
          options={options}
          selected={selectedGebietKey}
          onSelect={setSelectedGebietKey}
        />

        {selected && (
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <span className="font-medium text-foreground">
              {selected.gebietsname}
            </span>{" "}
            ({selected.gebietsart}, Nr. {selected.gebietsnummer})
          </p>
        )}

        <GebietResultsTable
          selected={selected}
          rows={resultRows}
          loading={resultsLoading}
          error={resultsError}
          hasImportedData={options.length > 0}
          ready={optionsLoaded}
        />
      </div>
    </div>
  )
}

export default App
