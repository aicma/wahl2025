import { useState } from "react";
import type { GebietOption } from "@/schema/gebietOptions"

const STORAGE_KEY = "gebiet-selected-keys";
const DEFAULT_KEY = "Bund:99";

function serialize(keys: (string | null)[]): string {
  return keys.map((k) => k ?? "").join(",");
}

function deserialize(raw: string): (string | null)[] {
  return raw.split(",").map((k) => k || null);
}

function readInitial(): (string | null)[] {
  // URL takes priority over localStorage
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("gebiete");
  const raw = fromUrl ?? localStorage.getItem(STORAGE_KEY);
  if (raw) return deserialize(raw);
  return [DEFAULT_KEY];
}

function persist(keys: (string | null)[]) {
  const value = serialize(keys);
  const params = new URLSearchParams(window.location.search);
  params.set("gebiete", value);
  localStorage.setItem(STORAGE_KEY, value);
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

const MAX_PANELS = 4

export function useGebietSelection() {
  const [selectedKeys, setSelectedKeys] = useState<(string | null)[]>(() =>
    readInitial(),
  );

  function updateKey(index: number, option: GebietOption | null) {
    setSelectedKeys((keys) => {
      const next = keys.map((k, i) => (i === index ? (option?.key ?? null) : k));
      persist(next);
      return next;
    });
  }

  function removePanel(index: number) {
    setSelectedKeys((keys) => {
      const next = keys.filter((_, i) => i !== index);
      persist(next);
      return next;
    });
  }

  function addPanel(key: string = DEFAULT_KEY) {
    setSelectedKeys((keys) => {
      if (keys.length >= MAX_PANELS) return keys
      const next = [...keys, key]
      persist(next)
      return next
    })
  }

  return { selectedKeys, updateKey, removePanel, addPanel, atMax: selectedKeys.length >= MAX_PANELS } as const;
}
