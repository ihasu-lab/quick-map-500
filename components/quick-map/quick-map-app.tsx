"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
}

export function QuickMapApp() {
  const [mode, setMode] = useState<Mode>("walk")
  const [filters, setFilters] = useState<FiltersState>(MODE_DEFAULTS.walk)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("pending")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const coordsRef = useRef(coords)
  coordsRef.current = coords

  const applyPosition = useCallback((position: GeolocationPosition) => {
    const next = { lat: position.coords.latitude, lng: position.coords.longitude }
    coordsRef.current = next
    setCoords(next)
    setGeoStatus("found")
    return next
  }, [])

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("denied")
      return
    }
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      () => setGeoStatus("denied"),
      GEO_OPTIONS,
    )
  }, [applyPosition])

  const ensureCoords = () =>
    new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (coordsRef.current) {
        resolve(coordsRef.current)
        return
      }
      if (!("geolocation" in navigator)) {
        setGeoStatus("denied")
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(applyPosition(position)),
        () => {
          setGeoStatus("denied")
          resolve(null)
        },
        GEO_OPTIONS,
      )
    })

  const handleModeChange = (nextMode: Mode) => {
    setMode(nextMode)
    setFilters(MODE_DEFAULTS[nextMode])
  }

  const handleFilterToggle = (key: FilterKey) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (key === "excludeChain" && next.excludeChain) next.chainOnly = false
      if (key === "chainOnly" && next.chainOnly) next.excludeChain = false
      return next
    })
  }

  const searchNearby = async (subject: string) => {
    const query = buildSearchQuery(subject, filters)
    const position = await ensureCoords()
    openMapsSearch(query, mode, position?.lat, position?.lng)
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
    () => buildSearchQuery(previewSubject, filters),
    [previewSubject, filters],
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


