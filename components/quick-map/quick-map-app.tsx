"use client"

import { useEffect, useMemo, useState } from "react"
import { StatusHeader, type GeoStatus } from "@/components/quick-map/status-header"
import { ModeToggle } from "@/components/quick-map/mode-toggle"
import { CategoryGrid } from "@/components/quick-map/category-grid"
import { FilterChips } from "@/components/quick-map/filter-chips"
import { QueryPreview } from "@/components/quick-map/query-preview"
import { CustomSearch } from "@/components/quick-map/custom-search"
import {
  buildSearchQuery,
  CATEGORIES,
  MODE_DEFAULTS,
  openMapsSearch,
  type FilterKey,
  type FiltersState,
  type Mode,
} from "@/lib/quick-map"

export function QuickMapApp() {
  const [mode, setMode] = useState<Mode>("walk")
  const [filters, setFilters] = useState<FiltersState>(MODE_DEFAULTS.walk.filters)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("pending")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("denied")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setGeoStatus("found")
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }, [])

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode)
    setFilters(MODE_DEFAULTS[nextMode].filters)
  }

  const handleFilterToggle = (key: FilterKey) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "excludeChain" && next.excludeChain) next.chainOnly = false
      if (key === "chainOnly" && next.chainOnly) next.excludeChain = false
      return next
    })
  }

  const searchNearby = (subject: string) => {
    const query = buildSearchQuery(subject, filters, mode)
    openMapsSearch(query, mode, coords?.lat, coords?.lng)
  }

  const handleCategorySelect = (categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return
    searchNearby(category.query)
  }

  const handleCustomSearch = (term: string) => {
    searchNearby(term)
  }

  const previewSubject = useMemo(() => {
    if (hoveredCategory) {
      return CATEGORIES.find((c) => c.id === hoveredCategory)?.query ?? "［カテゴリ］"
    }
    return "［カテゴリをタップ］"
  }, [hoveredCategory])

  const previewQuery = useMemo(
    () => buildSearchQuery(previewSubject, filters, mode),
    [previewSubject, filters, mode],
  )

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-10">
      <StatusHeader status={geoStatus} />

      <div className="flex flex-1 flex-col gap-6 px-5 pt-4">
        <ModeToggle mode={mode} onChange={handleModeChange} />

        <section aria-label="カテゴリから検索" className="flex flex-col gap-3">
          <SectionLabel>ワンタップ検索</SectionLabel>
          <CategoryGrid onSelect={handleCategorySelect} onHover={setHoveredCategory} />
        </section>

        <section aria-label="絞り込み条件" className="flex flex-col gap-3">
          <SectionLabel>トッピング条件</SectionLabel>
          <FilterChips filters={filters} onToggle={handleFilterToggle} />
        </section>

        <QueryPreview query={previewQuery} />

        <section aria-label="自由入力検索" className="flex flex-col gap-3">
          <SectionLabel>自由入力</SectionLabel>
          <CustomSearch onSearch={handleCustomSearch} />
        </section>
      </div>

      <p className="px-5 pt-8 text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
        タップすると現在地周辺でGoogleマップが開きます
      </p>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  )
}


