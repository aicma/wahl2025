import { z } from "zod";

/**
 * Zod schema for a single row of the kerg2 CSV published by
 * Die Bundeswahlleiterin. Column names match the official header row
 * (line 10, after the 9-line metadata preamble).
 *
 * Source: https://www.bundeswahlleiterin.de/bundestagswahlen/2025/ergebnisse/opendata.html
 */
export const kerg2RowSchema = z.object({
  Wahlart: z.string(),
  Wahltag: z.string(),
  Gebietsart: z.string(),
  Gebietsnummer: z.number(),
  Gebietsname: z.string(),
  UegGebietsart: z.string().optional().nullable(),
  UegGebietsnummer: z.number().optional().nullable(),
  Gruppenart: z.string(),
  Gruppenname: z.string(),
  Gruppenreihenfolge: z.number(),
  Stimme: z.number().optional().nullable(),
  Anzahl: z.number().optional().nullable(),
  Prozent: z.number().optional().nullable(),
  VorpAnzahl: z.number().optional().nullable(),
  VorpProzent: z.number().optional().nullable(),
  DiffProzent: z.number().optional().nullable(),
  DiffProzentPkt: z.number().optional().nullable(),
  Bemerkung: z.string().optional().nullable(),
  Gewählt: z.string().optional().nullable(),
});

export type ResultRow = z.infer<typeof kerg2RowSchema>;
