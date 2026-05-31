import { useCSV } from "@/hooks/useCSV"
import { kerg2RowSchema } from "@/schema/kerg2"
import { GebietPanel } from "@/components/GebietPanel"
import { GebietBarchart } from "@/components/GebietBarchart"
import { Button } from "@/components/ui/button"
import { useGebietSelection } from "@/hooks/useGebietSelection"
import { useStimmeSelector } from "@/hooks/useStimmeSelector"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { PanelErrorBoundary } from "@/components/PanelErrorBoundary"

const BTW25_CSV_URL = import.meta.env.DEV
  ? "/csv-proxy/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg2.csv"
  : "/wahl2025/data/kerg2.csv"
const BTW25_PARSE_OPTIONS = {
  delimiter: ";",
  skipLines: 9,
  rowSchema: kerg2RowSchema,
}

export function App() {
  const { records, gebietOptions, loading, status } = useCSV(BTW25_CSV_URL, BTW25_PARSE_OPTIONS)
  const { selectedKeys, updateKey, removePanel, addPanel, atMax } = useGebietSelection()
  const [stimme, setStimme] = useStimmeSelector()

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
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <h1 className="text-lg font-semibold">
            Bundestagswahl 2025 — Ergebnisse
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
          <div className="flex rounded-md border">
            <Button
              variant={stimme === 1 ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setStimme(1)}
            >
              Erststimme
            </Button>
            <Button
              variant={stimme === 2 ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setStimme(2)}
            >
              Zweitstimme
            </Button>
          </div>
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
            options={gebietOptions}
            resultRows={records}
            stimme={stimme ?? 2}
          />
        )}
        <div
          className={`grid gap-4 ${selectedKeys.length === 1 ? "grid-cols-1" :
            selectedKeys.length <= 4 ? "sm:grid-cols-1 md:grid-cols-2" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {selectedKeys.map((key, index) => (
            <PanelErrorBoundary key={index}>
              <GebietPanel
                options={gebietOptions}
                resultRows={records}
                selectedKey={key}
                stimme={stimme ?? 2}
                closeable={selectedKeys.length > 1}
                onSelect={(option) => updateKey(index, option)}
                onClose={() => removePanel(index)}
              />
            </PanelErrorBoundary>
          ))}
        </div>
        {!atMax && (
          <Button
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full"
            onClick={() => addPanel()}
          >
            + Add Gebiet
          </Button>
        )}
      </div>
    </div>
  )
}

export default App
