import type { ReactNode } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import type { GebietOption } from "@/lib/idb"
import type { ResultRow } from "@/schema/kerg2"
import React from "react"
import { GebietContext } from "./GebietContext"
import { GebietPiechart } from "./GebietPiechart"

interface GebietResultsTableProps {
  selected: GebietOption | null
  rows: ResultRow[]
  loading: boolean
  error: string | null
  hasImportedData: boolean
  ready: boolean
}

function Message({
  children,
  className = "text-sm text-muted-foreground",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className="rounded-md border border-dashed p-4">
      <p className={className}>{children}</p>
    </section>
  )
}

export function GebietResultsTable({
  selected,
  rows,
  loading,
  error,
  hasImportedData,
  ready,
}: GebietResultsTableProps) {
  const [sort, setSort] = React.useState<SortingState>([])

  const systemRows: ResultRow[] = rows.filter(
    (row) => row.Gruppenart === "System-Gruppe"
  )
  const ErststimmeResultRows: ResultRow[] = rows.filter(
    (row) => row.Gruppenart !== "System-Gruppe" && row.Stimme === 1
  )
  const ZweitstimmeResultRows: ResultRow[] = rows.filter(
    (row) => row.Gruppenart !== "System-Gruppe" && row.Stimme === 2
  )

  const ch = createColumnHelper<ResultRow>()
  const columns = [
    ch.accessor("Gruppenname", {}),
    ch.accessor("Gruppenart", {}),
    ch.accessor("Anzahl", {}),
    ch.accessor("Prozent", {}),
    ch.accessor("VorpAnzahl", {}),
    ch.accessor("VorpProzent", {}),
    ch.accessor("DiffProzent", {}),
    ch.accessor("DiffProzentPkt", {}),
  ]

  const table = useReactTable({
    data: ErststimmeResultRows,
    columns,
    state: {
      sorting: sort,
    },
    onSortingChange: setSort,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!ready) {
    return null
  }

  if (!hasImportedData) {
    return <Message>Import data to view results for a selected Gebiet.</Message>
  }

  if (!selected) {
    return <Message>Select a Gebiet to view its imported results.</Message>
  }

  if (loading) {
    return <Message>Loading results for {selected.gebietsname}…</Message>
  }

  if (error) {
    return <Message className="text-sm text-destructive">{error}</Message>
  }

  if (rows.length === 0) {
    return (
      <Message>
        No imported rows matched {selected.gebietsname} ({selected.gebietsart},{" "}
        Nr. {selected.gebietsnummer}).
      </Message>
    )
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">
          Results for {selected.gebietsname}
        </h2>
        <p className="text-sm text-muted-foreground">
          {rows.length} matching row{rows.length === 1 ? "" : "s"} for{" "}
          {selected.gebietsart}, Nr. {selected.gebietsnummer}
        </p>
      </div>
      {systemRows.length > 0 && <GebietContext systemRows={systemRows} />}
      <GebietPiechart resultRows={ZweitstimmeResultRows} />
      <div className="hidden overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="border-b px-3 py-2 text-left font-medium whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 align-top whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
