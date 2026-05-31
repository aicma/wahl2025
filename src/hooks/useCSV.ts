import { useEffect, useMemo, useState } from "react"
import { importCsv } from "@/lib/importCsv"
import type { ParseCsvOptions } from "@/lib/parseCsv"
import type { ResultRow } from "@/schema/kerg2"
import type { GebietOption } from "@/schema/gebietOptions"

interface UseCSVResult {
    records: ResultRow[]
    gebietOptions: GebietOption[]
    loading: boolean
    status: { ok: boolean; message: string } | null
}

export function useCSV(url: string, options: ParseCsvOptions): UseCSVResult {
    const [records, setRecords] = useState<ResultRow[]>([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)

    useEffect(() => {
        let ignore = false
        setLoading(true)

        importCsv(url, options)
            .then((data) => {
                if (ignore) return
                setRecords(data)
            })
            .catch((error) => {
                if (ignore) return
                const msg = error instanceof Error ? error.message : String(error)
                setStatus({ ok: false, message: msg })
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            ignore = true
        }
        // url and options are intentionally treated as stable — callers should pass
        // module-level constants to avoid re-fetching on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    const gebietOptions = useMemo<GebietOption[]>(
        () =>
            records.reduce<GebietOption[]>((acc, row) => {
                if (!acc.some((o) => o.key === `${row.Gebietsart}:${row.Gebietsnummer}`)) {
                    acc.push({
                        key: `${row.Gebietsart}:${row.Gebietsnummer}`,
                        gebietsart: row.Gebietsart,
                        gebietsnummer: row.Gebietsnummer,
                        gebietsname: row.Gebietsname,
                    })
                }
                return acc
            }, []),
        [records]
    )

    return { records, gebietOptions, loading, status }
}
