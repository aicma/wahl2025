import Papa from "papaparse";
import { z } from "zod";
import type { ResultRow } from "../schema/kerg2";

export interface ParseCsvOptions {
  /** Column delimiter. Defaults to auto-detect. */
  delimiter?: string;
  /** Number of leading rows to discard before the header row. Defaults to 0. */
  skipLines?: number;
  /**
   * Zod schema to validate each parsed row against. When provided, every row
   * is validated at runtime and parsing is rejected on the first violation.
   * When omitted, rows are returned as-is from PapaParse.
   */
  rowSchema?: z.ZodType<ResultRow>;
}

/**
 * Parses a CSV string into an array of rows, optionally validating each row against a Zod schema.
 * @param csvText The CSV string to parse.
 * @param options Options for parsing the CSV file.
 * @returns A promise that resolves to an array of parsed and validated rows.
 */
export function parseCsv(
  csvText: string,
  options: ParseCsvOptions = {},
): Promise<ResultRow[]> {
  const { delimiter, skipLines = 0, rowSchema } = options;

  // Strip UTF-8 BOM if present
  const text = csvText.startsWith("\uFEFF") ? csvText.slice(1) : csvText;

  // Drop leading metadata rows before the header
  const body =
    skipLines > 0
      ? text.split("\n").slice(skipLines).join("\n")
      : text;

  return new Promise((resolve, reject) => {
    const result = Papa.parse<ResultRow>(body, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transform: (value) => value.replace(',', '.'),
      ...(delimiter ? { delimiter } : {}),
    });
    if (result.errors.length > 0) {
      const first = result.errors[0];
      reject(
        new Error(`CSV parse error (row ${first.row}): ${first.message}`),
      );
      return;
    }

    if (!rowSchema) {
      resolve(result.data);
      return;
    }
    
    const validated: ResultRow[] = [];
    for (let i = 0; i < result.data.length; i++) {
      const parsed = rowSchema.safeParse(result.data[i]);
      if (!parsed.success) {
        
      console.debug("CSV parse error", parsed, result.data[i]   );
        reject(
          new Error(
            `CSV row ${i + 1} failed validation: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
          ),
        );
        return;
      }
      validated.push(parsed.data);
    }

    resolve(validated);
  });
}
