import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { GebietOption } from "@/schema/gebietOptions"
import { cn } from "@/lib/utils"

const GEBIETSART_ORDER = ["Bund", "Land", "Wahlkreis"]

interface GebietSearchProps {
  options: GebietOption[]
  selected: string | null
  onSelect: (option: GebietOption | null) => void
}

export function GebietSearch({
  options,
  selected,
  onSelect,
}: GebietSearchProps) {
  const [open, setOpen] = useState(false)

  const disabled = options.length === 0

  // Group options by Gebietsart
  const grouped = GEBIETSART_ORDER.map((art) => ({
    art,
    items: options
      .filter((o) => o.gebietsart === art)
      .sort((a, b) => (a.gebietsname < b.gebietsname ? -1 : 1)),
  })).filter((g) => g.items.length > 0)

  function handleSelect(option: GebietOption) {
    onSelect(option)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="flex grow justify-between text-base font-medium"
        >
          <span className="truncate">
            {selected
              ? (options.find((o) => o.key === selected)?.gebietsname ??
                "Unknown selection")
              : disabled
                ? "Import data first"
                : "Search Gebiet…"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search Gebietsname…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {grouped.map(({ art, items }) => (
              <CommandGroup key={art} heading={art}>
                {items.map((option) => (
                  <CommandItem
                    key={option.key}
                    value={option.gebietsname}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected === option.key ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.gebietsname}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
