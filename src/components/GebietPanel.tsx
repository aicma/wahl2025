import { useState } from "react"
import { GebietSearch } from "@/components/GebietSearch"
import { GebietPiechart } from "@/components/GebietPiechart"
import { GebietContext } from "@/components/GebietContext"
import { GebietResultsTable } from "@/components/GebietResultsTable"
import type { GebietOption } from "@/lib/idb"
import type { ResultRow } from "@/schema/kerg2"
import { Button } from "./ui/button"
import { X } from "lucide-react"

interface GebietPanelProps {
  options: GebietOption[]
  resultRows: ResultRow[]
  onClose: () => void
}

export function GebietPanel({
  options,
  resultRows,
  onClose,
}: GebietPanelProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>("Bund99") // Default to "Bund99" (whole Germany)

  const selected = options.find((o) => o.key === selectedKey) ?? null

  const selectedRows = resultRows.filter(
    (r) => `${r.Gebietsart}${r.Gebietsnummer}` === selectedKey
  )
  const systemRows = selectedRows.filter(
    (r) => r.Gruppenart === "System-Gruppe"
  )
  const dataRows = selectedRows.filter(
    (r) => r.Gruppenart !== "System-Gruppe" && r.Stimme === 2
  )

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <GebietSearch
          options={options}
          selected={selectedKey}
          onSelect={(option) => setSelectedKey(option?.key ?? null)}
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
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <span className="font-medium text-foreground">
              {selected.gebietsname}
            </span>{" "}
            ({selected.gebietsart}, Nr. {selected.gebietsnummer})
          </p>

          <GebietPiechart resultRows={dataRows} />
          <GebietContext systemRows={systemRows} />
          <GebietResultsTable rows={dataRows} />
        </>
      )}
    </div>
  )
}
