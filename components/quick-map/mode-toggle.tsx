"use client"

import { Car, Footprints } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mode } from "@/lib/quick-map"

interface ModeToggleProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="検索モード"
      className="grid grid-cols-2 gap-2 rounded-3xl bg-secondary p-1.5"
    >
      <ModeButton
        active={mode === "walk"}
        onClick={() => onChange("walk")}
        icon={<Footprints className="size-5" aria-hidden="true" />}
        label="徒歩モード"
        activeClass="bg-primary text-primary-foreground"
      />
      <ModeButton
        active={mode === "drive"}
        onClick={() => onChange("drive")}
        icon={<Car className="size-5" aria-hidden="true" />}
        label="ドライブモード"
        activeClass="bg-drive text-drive-foreground"
      />
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
  activeClass,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  activeClass: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-[1.35rem] px-3 py-3 transition-colors",
        active ? activeClass : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
