import { describe, it, expect } from "vitest";
import { parseCsv } from "./parseCsv";
import { kerg2RowSchema } from "../schema/kerg2";

const VALID_CSV = `Wahlart,Wahltag,Gebietsart,Gebietsnummer,Gebietsname,UegGebietsart,UegGebietsnummer,Gruppenart,Gruppenname,Gruppenreihenfolge,Stimme,Anzahl,Prozent,VorpAnzahl,VorpProzent,DiffProzent,DiffProzentPkt,Bemerkung,Gewählt
BTW,23.02.2025,Bund,0,Bundesgebiet,,, Partei,CDU/CSU,1,1,8032423,28.6,7255398,26.8,1.8,1.8,,
BTW,23.02.2025,Bund,0,Bundesgebiet,,,Partei,SPD,2,1,6432425,22.9,5179430,20.5,2.4,2.4,,`;

const INVALID_CSV = `Wahlart,Wahltag,Gebietsart
BTW,23.02.2025
"unclosed quote,missing fields`;

describe("parseCsv", () => {
  describe("without schema", () => {
    it("resolves with parsed rows for valid CSV", async () => {
      const rows = await parseCsv(VALID_CSV);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({ Wahlart: "BTW", Gebietsname: "Bundesgebiet" });
    });

    it("rejects with a parse error for a malformed CSV string", async () => {
      await expect(parseCsv(INVALID_CSV)).rejects.toThrow(/CSV parse error/);
    });
  });

  describe("with rowSchema", () => {
    it("resolves with validated rows for valid CSV", async () => {
      const rows = await parseCsv(VALID_CSV, { rowSchema: kerg2RowSchema });
      expect(rows).toHaveLength(2);
      expect(rows[0].Gruppenname).toBe("CDU/CSU");
      expect(typeof rows[0].Gebietsnummer).toBe("number");
    });

    it("rejects when a row fails schema validation", async () => {
      // CSV with a required numeric field (Gebietsnummer) set to a non-numeric value
      const badCsv = `Wahlart,Wahltag,Gebietsart,Gebietsnummer,Gebietsname,UegGebietsart,UegGebietsnummer,Gruppenart,Gruppenname,Gruppenreihenfolge,Stimme,Anzahl,Prozent,VorpAnzahl,VorpProzent,DiffProzent,DiffProzentPkt,Bemerkung,Gewählt
BTW,23.02.2025,Bund,NOT_A_NUMBER,Bundesgebiet,,,Partei,CDU/CSU,1,1,8032423,28.6,,,,,, `;
      await expect(parseCsv(badCsv, { rowSchema: kerg2RowSchema })).rejects.toThrow(
        /failed validation/,
      );
    });
  });

  describe("options", () => {
    it("skips leading metadata rows with skipLines", async () => {
      const csvWithPreamble = `metadata line 1\nmetadata line 2\n${VALID_CSV}`;
      const rows = await parseCsv(csvWithPreamble, { skipLines: 2 });
      expect(rows).toHaveLength(2);
    });

    it("strips a UTF-8 BOM if present", async () => {
      const rows = await parseCsv("\uFEFF" + VALID_CSV);
      expect(rows).toHaveLength(2);
    });
  });
});
