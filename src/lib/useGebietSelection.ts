import { useState } from "react";
import type { GebietOption } from "./idb";

const STORAGE_KEY = "gebiet-selected-key";

function readInitial(options: GebietOption[]): string | null {
  if (options.length === 0) return null;

  // URL takes priority over localStorage
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("gebiet");
  const raw = fromUrl ?? localStorage.getItem(STORAGE_KEY) ?? "Bund99"; // Default to "Bund99" (whole Germany) if nothing else is set
  if (!raw) return null;

  return raw;
}

export function useGebietSelection(options: GebietOption[]) {
  const [selected, setSelectedState] = useState<string | null>(() =>
    readInitial(options),
  );

  const setSelected =
    (option: GebietOption | null) => {
      setSelectedState(option ? option.key : null);
      const params = new URLSearchParams(window.location.search);
      if (option) {
        params.set("gebiet", option.key);
        localStorage.setItem(STORAGE_KEY, option.key);
      } else {
        params.delete("gebiet");
        localStorage.removeItem(STORAGE_KEY);
      }
      const newUrl = params.size
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    };

  return [selected, setSelected] as const;
}
