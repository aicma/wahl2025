import { useState } from "react";

const STORAGE_KEY = "stimme-selected";

    /**
     * Handles the selection of "Stimme" (vote type) in the application. It reads the initial value from the URL or localStorage, and provides a function to update the selection. The selection is persisted in both the URL and localStorage, allowing for state to be maintained across page reloads and shared via URL.
     * @returns A tuple containing the current "Stimme" value and a function to update it.
     */
export function useStimmeSelector() {
  const [stimme, setStimme] = useState<number | null>(() =>{
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("stimme");
    const raw = fromUrl ?? localStorage.getItem(STORAGE_KEY) ?? "2"; // Default to "2" (Zweitstimme) if nothing else is set
    return raw ? parseInt(raw, 10) : null;
  }
    ,
  );
  const setSelected =
    (option: number | null) => {
      setStimme(option);
      const params = new URLSearchParams(window.location.search);
      if (option !== null) {
        params.set("stimme", option.toString());
        localStorage.setItem(STORAGE_KEY, option.toString());
      } else {
        params.delete("stimme");
        localStorage.removeItem(STORAGE_KEY);
      }
      const newUrl = params.size
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    };

  return [stimme, setSelected] as const;
}
