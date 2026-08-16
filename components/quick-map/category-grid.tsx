"use client"

import type { ComponentType } from "react"
import { Beer, Coffee, Flame, Soup, Store, UtensilsCrossed } from "lucide-react"
import { CATEGORIES } from "@/lib/quick-map"

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  ramen: Soup,
  teishoku: UtensilsCrossed,
  cafe: Coffee,
  izakaya: Beer,
  curry: Flame,
  conveni: Store,
}

interface CategoryGridProps {
  onSelect: (categoryId: string) => void
  onHover?: (categoryId: string | null) => void
}

export function CategoryGrid({ onSelect, onHover }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="list" aria-label="カテゴリから検索">
      {CATEGORIES.map((category) => {
        const Icon = ICONS[category.id]
        return (
          <button
            key={category.id}
            type="button"
            role="listitem"
            onClick={() => onSelect(category.id)}
            onMouseEnter={() => onHover?.(category.id)}
            onFocus={() => onHover?.(category.id)}
            onTouchStart={() => onHover?.(category.id)}
            className="group flex flex-col items-start gap-3 rounded-3xl border border-border bg-card p-4 text-left transition-all active:scale-[0.97] active:bg-accent"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-colors group-active:bg-primary group-active:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-base font-bold leading-tight text-foreground">
                {category.label}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {category.sublabel}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
