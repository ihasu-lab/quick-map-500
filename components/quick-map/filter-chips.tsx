"use client"

import { Clock, ParkingCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FilterKey, FiltersState } from "@/lib/quick-map"

interface FilterChipsProps {
  filters: FiltersState
  onToggle: (key: FilterKey) => void
}

const CHIP_CONFIG: { key: FilterKey; label: string; icon: typeof Clock }[] = [
  { key: "openNow", label: "営業中のみ", icon: Clock },
  { key: "parking", label: "駐車場あり", icon: ParkingCircle },
]

export function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="絞り込み条件">
      {CHIP_CONFIG.map(({ key, label, icon: Icon }) => {
        const active = filters[key]
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
