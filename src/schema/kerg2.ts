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
  UegGebietsart: z.string().optional(),
  UegGebietsnummer: z.number().optional(),
  Gruppenart: z.string(),
  Gruppenname: z.string(),
  Gruppenreihenfolge: z.number(),
  Stimme: z.number().optional(),
  Anzahl: z.number().optional(),
  Prozent: z.number().optional(),
  VorpAnzahl: z.number().optional(),
  VorpProzent: z.number().optional(),
  DiffProzent: z.number().optional(),
  DiffProzentPkt: z.number().optional(),
  Bemerkung: z.string().optional(),
  Gewählt: z.string().optional(),
});

export type ResultRow = z.infer<typeof kerg2RowSchema>;
