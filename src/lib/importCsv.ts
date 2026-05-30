import { fetchCsv } from "./fetchCsv";
import { parseCsv, type ParseCsvOptions } from "./parseCsv";
import type { ResultRow } from "@/schema/kerg2";

export async function importCsv(
  url: string,
  parseOptions?: ParseCsvOptions,
): Promise<ResultRow[]> {
  const csvText = await fetchCsv(url);
  const records = await parseCsv(csvText, parseOptions);
  // await storeRecords(url, records);
  return records;
}
