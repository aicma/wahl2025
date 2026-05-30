export interface GebietOption {
  /** Composite key: `Gebietsart+Gebietsnummer`, e.g. "Wahlkreis11" */
  key: string;
  gebietsnummer: number;
  gebietsname: string;
  gebietsart: string;
}