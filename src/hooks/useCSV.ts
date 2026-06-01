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
/**
 * Custom hook to fetch and parse CSV data. Provides the parsed records, unique Gebiet options, loading state, and Error status of the fetch operation.
 * @param url The URL of the CSV file to fetch. This is constant for now. but could be made dynamic in the future to allow for different datasets.
 * @param options Options for parsing the CSV file.
 * @returns An object containing the parsed records, Gebiet options, loading state, and status.
 */
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
