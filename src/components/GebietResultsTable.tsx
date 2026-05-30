import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import type { ResultRow } from "@/schema/kerg2"
import React from "react"

interface GebietResultsTableProps {
  rows: ResultRow[]
}

export function GebietResultsTable({ rows }: GebietResultsTableProps) {
  const [sort, setSort] = React.useState<SortingState>([
    { id: "Prozent", desc: true },
  ])

  const ch = createColumnHelper<ResultRow>()
  const columns = [
    ch.accessor("Gruppenname", {}),
    ch.accessor("Anzahl", {}),
    ch.accessor("Prozent", {
      cell: (info) =>
        info.getValue() != null ? `${info.getValue()!.toFixed(2)} %` : "",
    }),
  ]

  const table = useReactTable({
    data: rows.filter((r) => r.Prozent), // Only show Zweitstimme results in the table
    columns,
    state: {
      sorting: sort,
    },
    onSortingChange: setSort,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <section className="space-y-3">
      <div className="overflow-x-auto rounded-md border">
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
