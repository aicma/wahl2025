import { GebietSearch } from "@/components/GebietSearch"
import { GebietPiechart } from "@/components/GebietPiechart"
import { GebietContext } from "@/components/GebietContext"
import { GebietResultsTable } from "@/components/GebietResultsTable"
import type { GebietOption } from "@/schema/gebietOptions"
import type { ResultRow } from "@/schema/kerg2"
import { Button } from "./ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { X, ChevronsUpDown } from "lucide-react"

interface GebietPanelProps {
  options: GebietOption[]
  resultRows: ResultRow[]
  selectedKey: string | null
  stimme: number
  onSelect: (option: GebietOption | null) => void
  onClose: () => void
}

export function GebietPanel({
  options,
  resultRows,
  selectedKey,
  stimme,
  onSelect,
  onClose,
}: GebietPanelProps) {
  const selected = options.find((o) => o.key === selectedKey) ?? null

  const selectedRows = resultRows.filter(
    (r) => `${r.Gebietsart}:${r.Gebietsnummer}` === selectedKey
  )
  const systemRows = selectedRows.filter(
    (r) => r.Gruppenart === "System-Gruppe"
  )
  const dataRows = selectedRows.filter(
    (r) => r.Gruppenart !== "System-Gruppe" && r.Stimme === stimme
  )

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <GebietSearch
          options={options}
          selected={selectedKey}
          onSelect={onSelect}
        />
        <Button
          variant="outline"
          size="icon"
          aria-label="close"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      {selected && (
        <>
          <GebietPiechart resultRows={dataRows} />
          <GebietContext systemRows={systemRows} />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex w-full items-center justify-between"
              >
                {stimme === 1 ? "Erststimmen-Ergebnisse" : "Zweitstimmen-Ergebnisse"}
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <GebietResultsTable rows={dataRows} />
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  )
}
